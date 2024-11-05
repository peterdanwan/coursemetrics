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

export const GET = withApiAuthRequired(async function get_professor_by_professor_id(
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
});

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
