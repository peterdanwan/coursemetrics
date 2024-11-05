// app/api/courses/[courseCode]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Course from '@/database/models/Course';
import { logger } from '@/utils';
import CourseDetail from '@/database/models/CourseDetail';
import CourseTerm from '@/database/models/CourseTerm';

// ===== API ROUTE TO FETCH COURSE BY COURSE CODE =====
export const GET = withApiAuthRequired(async function get_course_by_course_code(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/[courseCode]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const courseCode = url.pathname.split('/').pop();

    log.info(`Fetching course with code: ${courseCode}`);

    let season = req.nextUrl.searchParams.get('season');
    season = String(season).charAt(0).toUpperCase() + String(season).slice(1);
    let year = Number(req.nextUrl.searchParams.get('year'));

    const whereConditions = { course_code: courseCode };

    let courseTermConditions: { season?: any; year?: any } = {};
    if (season !== null && season !== undefined && season !== 'Null') {
      courseTermConditions.season = season;
    }

    if (year !== null && year !== undefined && year !== 0) {
      courseTermConditions.year = year;
    }

    if (season === 'Null' && year === 0) {
      courseTermConditions = {};
    }

    const courses = await Course.findAll({
      where: whereConditions,
      order: [
        [CourseTerm, 'year', 'DESC'],
        [CourseTerm, 'season', 'DESC'],
      ],
      include: [
        {
          model: CourseDetail,
          attributes: ['course_name', 'course_description'],
        },
        {
          model: CourseTerm,
          attributes: ['season', 'year'],
          where: courseTermConditions,
        },
      ],
    });

    log.debug(
      {
        courses,
      },
      'Courses by ID fetched from DB'
    );

    log.info('Courses by ID fetched successfully');

    return NextResponse.json(
      createSuccessResponse({
        courses,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching courses by ID', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});

// ===== API ROUTE TO DELETE COURSE BY COURSE CODE =====
export const DELETE = withApiAuthRequired(async function delete_course_by_course_code(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/[courseCode]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const courseCode = url.pathname.split('/').pop();

    const course = await Course.findByPk(courseCode);

    if (!course) {
      log.warn('Course not found', { courseCode });
      return NextResponse.json(createErrorResponse(404, 'Course not found'), { status: 404 });
    }

    try {
      await course.destroy();
    } catch (error) {
      log.error(error);
      return NextResponse.json(
        createErrorResponse(
          409,
          "Could not delete course record since it's associated with other records"
        ),
        { status: 409 }
      );
    }

    log.info('Course deleted successfully', { courseCode });
    return NextResponse.json(createSuccessResponse({ message: 'Course deleted successfully' }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error deleting course by courseCode', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
