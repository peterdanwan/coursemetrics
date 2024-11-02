// app/api/professors/course/[courseCode]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Professor from '@/database/models/Professor';
import ProfessorCourse from '@/database/models/ProfessorCourse';
import Course from '@/database/models/Course';
import { logger } from '@/utils';

// ===== API ROUTE TO FETCH PROFESSORS BY COURSE CODE =====
export const GET = async function get_professors_by_course(
  req: NextRequest,
  { params }: { params: { courseCode: string } }
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/professors/course/[courseCode]/route.ts' });
  const { courseCode } = params; // Get the courseCode from the URL parameters

  try {
    // Connect to the database
    await connectDB();

    log.info('Fetching professors for course code', { courseCode });

    // Step 1: Find all courses that match the courseCode
    const courses = await Course.findAll({
      where: { course_code: courseCode }, // Assuming course_code is the column to filter by
    });

    if (courses.length === 0) {
      log.info('No courses found for course code', { courseCode });
      return NextResponse.json(
        createErrorResponse(404, 'No courses found for the specified course code.'),
        { status: 404 }
      );
    }

    // Step 2: Get the course IDs of the retrieved courses
    const courseIds = courses.map((course) => course.course_id); // Adjust according to your model

    // Step 3: Find professors associated with the retrieved course IDs
    const professors = await Professor.findAll({
      include: [
        {
          model: ProfessorCourse,
          where: { course_id: courseIds }, // Filter by the array of course IDs
        },
      ],
    });

    if (professors.length === 0) {
      log.info('No professors found for the specified courses', { courseCode });
      return NextResponse.json(
        createErrorResponse(404, 'No professors found for the specified course code.'),
        { status: 404 }
      );
    }

    log.info('Professors fetched successfully', {
      courseCode,
      totalProfessors: professors.length,
    });

    return NextResponse.json(
      createSuccessResponse({
        professors,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching professors by course code', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
