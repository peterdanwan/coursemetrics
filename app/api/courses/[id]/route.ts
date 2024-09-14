import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import connectDB from '@/config/database';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import { Course } from '@/models/Course';
import { logger } from '@/utils';

// ===== API ROUTE TO FETCH A COURSE BY ID =====

export const GET = withApiAuthRequired(async function get_course_by_id( // Ignore this warning. It is some typescript issue that we can fix later
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const log = logger.child({ module: 'api/courses/[id]' });

  try {
    await connectDB();
    const courseId: string = params.id;

    // Validate course ID
    if (!courseId) {
      log.error('Course ID is required');
      return NextResponse.json(
        createErrorResponse(400, 'Course ID is required'),
        { status: 400 }
      );
    }

    log.info('Fetching course', { courseId });

    // Fetch the course by ID
    const course = await Course.findById(courseId)
      .populate('courseDetailId')
      .exec();

    log.debug({ course }, 'Course fetched from DB');
    log.info('Course fetched successfully', { courseId });

    return NextResponse.json(createSuccessResponse({ course }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching course', { error });

    if (error instanceof Error) {
      if (error.name === 'CastError') {
        log.error('Course not found');
        return NextResponse.json(createErrorResponse(404, 'Course not found'), {
          status: 404,
        });
      }
      return NextResponse.json(createErrorResponse(500, error.message), {
        status: 500,
      });
    }

    return NextResponse.json(
      createErrorResponse(
        500,
        'Something went wrong. A server-side issue occurred.'
      ),
      { status: 500 }
    );
  }
});
