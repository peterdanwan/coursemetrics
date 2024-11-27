// app/api/professors/[professorId]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Professor from '@/database/models/Professor';
import { logger } from '@/utils';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import Course from '@/database/models/Course';
import ProfessorCourse from '@/database/models/ProfessorCourse';
import CourseTerm from '@/database/models/CourseTerm';
import { Op } from 'sequelize';

export const dynamic = 'force-dynamic';

export const GET = async function get_professor_by_professor_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/professors/[professorId]/route.ts' });

  try {
    await connectDB();

    const url = new URL(req.url);

    const professorId = url.pathname.split('/').pop();

    const professor = await Professor.findByPk(professorId);

    if (!professor) {
      log.warn('Professor not found', { professorId });
      return NextResponse.json(createErrorResponse(404, 'Professor not found'), { status: 404 });
    }

    // Fetch courses associated with this professor
    const professorCourses = await ProfessorCourse.findAll({
      where: { professor_id: professorId },
      include: {
        model: Course, // Join with the Course model
        attributes: ['course_id', 'course_code', 'course_section'], // Select relevant fields from Course
        include: [
          {
            model: CourseTerm, // Join with the CourseTerm model
            attributes: ['season', 'year'], // Select season and year fields
          },
        ],
      },
    });

    return NextResponse.json(createSuccessResponse({ professor, professorCourses }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error getting professor by professorId', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};

export const DELETE = withApiAuthRequired(async function delete_professor_by_professor_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/professors/[professorId]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const professorId = url.pathname.split('/').pop();

    const professor = await Professor.findByPk(professorId);

    if (!professor) {
      log.warn('Professor not found', { professorId });
      return NextResponse.json(createErrorResponse(404, 'Professor not found'), { status: 404 });
    }

    try {
      await professor.destroy();
    } catch (error) {
      log.error(error);
      return NextResponse.json(
        createErrorResponse(
          409,
          "Could not delete professor record since it's associated with other records"
        ),
        { status: 409 }
      );
    }

    log.info('Professor deleted successfully', { professorId });
    return NextResponse.json(createSuccessResponse({ message: 'Professor deleted successfully' }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error deleting professor by professorId', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});

export const PATCH = withApiAuthRequired(async function update_professor_by_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/professors/[id]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);
    const professorId = url.pathname.split('/').pop();
    const body = await req.json();
    const { first_name, last_name, forceUpdate } = body;

    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'Both first name and last name are required for update.' },
        { status: 400 }
      );
    }

    // Find the professor by ID
    const professor = await Professor.findByPk(professorId);

    if (!professor) {
      return NextResponse.json({ error: 'Professor not found' }, { status: 404 });
    }

    // Check if another professor already exists with the same name, but exclude the current professor
    if (!forceUpdate) {
      const existingProfessor = await Professor.findOne({
        where: {
          first_name,
          last_name,
          professor_id: { [Op.ne]: professorId },
        },
      });

      if (existingProfessor) {
        return NextResponse.json(
          {
            error:
              'Professor with this name already exists. Are you sure you want to proceed with this update?',
          },
          { status: 409 }
        );
      }
    }

    // Update the professor fields using `update`
    await professor.update({
      first_name,
      last_name,
    });
    log.info('Professor updated successfully', { professor });

    return NextResponse.json(
      { message: 'Professor updated successfully', professor: professor.toJSON() },
      { status: 200 }
    );
  } catch (error) {
    log.error('Error updating professor', { error });
    return NextResponse.json({ error: 'Failed to update professor' }, { status: 500 });
  }
});
