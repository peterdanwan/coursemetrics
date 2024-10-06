// app/api/courses/[courseCode]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { connectDB } from '@/config/database';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import { Course } from '@/models/Course';
import { logger } from '@/utils';

// ===== API ROUTE TO FETCH A COURSE BY CODE =====

export const GET = withApiAuthRequired(async function get_course_by_code( // Ignore this warning. It is some typescript issue that we can fix later
  req: NextRequest,
  { params }: { params: { courseCode: string } }
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/[courseCode]/route.ts' });

  try {
    await connectDB();
    const courseCode: string = params.courseCode;

    // Validate course code
    if (!courseCode) {
      log.error('Course code is required');
      return NextResponse.json(createErrorResponse(400, 'Course code is required'), {
        status: 400,
      });
    }

    log.info(`Fetching course ${courseCode}`);

    // Fetch the course by course code
    const course = await Course.findOne({ courseCode }).populate('courseDetailId').exec();

    console.log('CC:', courseCode);

    if (!course) {
      log.error('Course not found');
      return NextResponse.json(createErrorResponse(404, 'Course not found'), {
        status: 404,
      });
    }

    log.debug({ course }, 'Course fetched from DB');
    log.info('Course fetched successfully', { courseCode });

    return NextResponse.json(createSuccessResponse({ course }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching course', { error });

    if (error instanceof Error) {
      return NextResponse.json(createErrorResponse(500, error.message), {
        status: 500,
      });
    }

    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
