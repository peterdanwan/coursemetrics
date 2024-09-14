// app/api/reviews/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import connectDB from '@/config/database';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import { Course } from '@/models/Course';
import { logger } from '@/utils';

// ===== API ROUTE TO FETCH ALL COURSES =====
export const GET = withApiAuthRequired(async function get_courses(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'api/reviews' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const queryParams: { page: string; limit: string } = {
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '10',
    };

    const pageNumber: number = parseInt(queryParams.page, 10);
    const limitNumber: number = parseInt(queryParams.limit, 10);

    // Validate pagination parameters
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      log.error('Invalid pagination parameters', { pageNumber, limitNumber });
      return NextResponse.json(createErrorResponse(400, 'Invalid pagination parameters'), {
        status: 400,
      });
    }

    // Calculate the number of documents to skip
    const skip: number = (pageNumber - 1) * limitNumber;

    log.info('Fetching courses', { pageNumber, limitNumber });

    // Fetch the courses and count the total number of documents
    const courses = await Course.find()
      .skip(skip)
      .limit(limitNumber)
      .populate('courseDetailId')
      .exec();

    const totalCourses: number = await Course.countDocuments();
    const totalPages: number = Math.ceil(totalCourses / limitNumber);

    log.debug(
      {
        courses,
        totalPages,
        currentPage: pageNumber,
        totalCourses,
      },
      'Courses fetched from DB'
    );

    log.info('Courses fetched successfully', {
      totalPages,
      currentPage: pageNumber,
      totalCourses,
    });

    return NextResponse.json(
      createSuccessResponse({
        courses,
        totalPages,
        currentPage: pageNumber,
        totalCourses,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching courses', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
