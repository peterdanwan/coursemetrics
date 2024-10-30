// app/api/courses/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Course from '@/database/models/Course';
import { logger } from '@/utils';
import CourseDetail from '@/database/models/CourseDetail';
import CourseTerm from '@/database/models/CourseTerm';
import CourseDeliveryFormat from '@/database/models/CourseDeliveryFormat';

// ===== API ROUTE TO FETCH ALL COURSES =====
export const GET = withApiAuthRequired(async function get_courses(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    // const queryParams: { page: string; limit: string } = {
    //   page: url.searchParams.get('page') || '1',
    //   limit: url.searchParams.get('limit') || '10',
    // };

    // Ref Doc: https://www.shecodes.io/athena/60744-what-is-parseint-in-javascript#
    // const pageNumber: number = parseInt(queryParams.page, 10);
    // const limit: number = parseInt(queryParams.limit, 10);

    // Validate pagination parameters
    // if (isNaN(pageNumber) || isNaN(limit) || pageNumber < 1 || limit < 1) {
    //   log.error('Invalid pagination parameters', { pageNumber, limit });
    //   return NextResponse.json(createErrorResponse(400, 'Invalid pagination parameters'), {
    //     status: 400,
    //   });
    // }

    // log.info('Fetching courses', { pageNumber, limit });

    const { count: totalCourses, rows: courses } = await Course.findAndCountAll({
      // offset: (pageNumber - 1) * limit,
      // limit,
      order: [['course_code', 'ASC']],
      include: [
        {
          model: CourseDetail,
          attributes: ['course_name', 'course_description'],
        },
        {
          model: CourseTerm,
          attributes: ['season', 'year'],
        },
        {
          model: CourseDeliveryFormat,
          attributes: ['format', 'description'],
        },
      ],
    });

    // const totalPages = Math.ceil(totalCourses / limit);

    log.debug(
      {
        courses,
        // totalPages,
        // currentPage: pageNumber,
        totalCourses,
      },
      'Courses fetched from DB'
    );

    log.info('Courses fetched successfully');

    return NextResponse.json(
      createSuccessResponse({
        courses,
        // totalPages,
        // currentPage: pageNumber,
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
