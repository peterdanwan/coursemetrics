// // app/api/courses/[courseCode]/route.ts

// import { NextResponse, NextRequest } from 'next/server';
// import { withApiAuthRequired } from '@auth0/nextjs-auth0';
// import { connectDB } from '@/database/connectDB';
// import { createSuccessResponse, createErrorResponse } from '@/utils';
// import Course from '@/database/models/Course';
// import { logger } from '@/utils';

// // ===== API ROUTE TO FETCH A COURSE BY CODE =====

// export const GET = withApiAuthRequired(async function get_course_by_code( // Ignore this warning. It is some typescript issue that we can fix later
//   req: NextRequest,
//   { params }: { params: { courseCode: string } }
// ): Promise<NextResponse> {
//   const log = logger.child({ module: 'app/api/courses/[courseCode]/route.ts' });

//   try {
//     await connectDB();
//     const courseCode: string = params.courseCode;

//     // Validate course code
//     if (!courseCode) {
//       log.error('Course code is required');
//       return NextResponse.json(createErrorResponse(400, 'Course code is required'), {
//         status: 400,
//       });
//     }

//     log.info(`Fetching course ${courseCode}`);

//     // Fetch the course by course code
//     const course = await Course.findOne({ courseCode }).populate('courseDetailId').exec();

//     console.log('CC:', courseCode);

//     if (!course) {
//       log.error('Course not found');
//       return NextResponse.json(createErrorResponse(404, 'Course not found'), {
//         status: 404,
//       });
//     }

//     log.debug({ course }, 'Course fetched from DB');
//     log.info('Course fetched successfully', { courseCode });

//     return NextResponse.json(createSuccessResponse({ course }), {
//       status: 200,
//     });
//   } catch (error: unknown) {
//     console.error(error);
//     log.error('Error fetching course', { error });

//     if (error instanceof Error) {
//       return NextResponse.json(createErrorResponse(500, error.message), {
//         status: 500,
//       });
//     }

//     return NextResponse.json(
//       createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
//       { status: 500 }
//     );
//   }
// });

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
export const GET = withApiAuthRequired(async function get_codsdsurses(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const queryParams: { page: string; limit: string } = {
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '10',
    };

    // Ref Doc: https://www.shecodes.io/athena/60744-what-is-parseint-in-javascript#
    const pageNumber: number = parseInt(queryParams.page, 10);
    const limit: number = parseInt(queryParams.limit, 10);

    // Validate pagination parameters
    if (isNaN(pageNumber) || isNaN(limit) || pageNumber < 1 || limit < 1) {
      log.error('Invalid pagination parameters', { pageNumber, limit });
      return NextResponse.json(createErrorResponse(400, 'Invalid pagination parameters'), {
        status: 400,
      });
    }

    log.info('Fetching courses', { pageNumber, limit });

    const { count: totalCourses, rows: courses } = await Course.findAndCountAll({
      offset: (pageNumber - 1) * limit,
      limit,
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

    const totalPages = Math.ceil(totalCourses / limit);

    log.debug(
      {
        courses,
        totalPages,
        currentPage: pageNumber,
        totalCourses,
      },
      'Courses fetched from DB'
    );

    log.info('Courses fetched successfully');

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
