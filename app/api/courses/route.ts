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
import ProfessorCourse from '@/database/models/ProfessorCourse';
import Professor from '@/database/models/Professor';

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

// ===== API ROUTE TO CREATE A NEW COURSE =====
export const POST = withApiAuthRequired(async function create_course(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/route.ts' });

  // Log the incoming request for debugging and auditing
  log.info('Received POST request to create course', { body: req.body });
  const body = await req.json();

  const {
    course_code,
    course_section,
    course_detail: { course_name, course_description },
    course_term: { season, year },
    course_delivery_format_id,
    professors,
  } = body;

  // Check if all required fields are provided
  if (
    !course_code ||
    !course_section ||
    !course_name ||
    !course_description ||
    !course_delivery_format_id ||
    !season ||
    !year
  ) {
    return NextResponse.json(createErrorResponse(400, 'Missing required fields'), { status: 400 });
  }

  try {
    // Step 1: Create CourseDetail
    const [courseDetail] = await CourseDetail.findOrCreate({
      where: {
        course_name: course_name,
        course_description: course_description,
      },
    });
    log.info('CourseDetail found or created', { courseDetail });

    // Step 2: Find or create CourseTerm
    const [courseTerm] = await CourseTerm.findOrCreate({
      where: {
        season: season,
        year: year,
      },
    });
    log.info('CourseTerm found or created', { courseTerm });

    // Step 3.1: Check if the course already exists with the same information
    const existingCourse = await Course.findOne({
      where: {
        course_code,
        course_section,
        course_detail_id: courseDetail.course_detail_id,
        course_term_id: courseTerm.course_term_id,
        course_delivery_format_id: course_delivery_format_id,
      },
    });

    if (existingCourse) {
      // If an identical course exists, return a 409 Conflict response
      return NextResponse.json(createErrorResponse(409, 'This course already exists.'), {
        status: 409,
      });
    }

    // Step 3.2: Create Course
    const course = await Course.create({
      course_code,
      course_section,
      course_detail_id: courseDetail.course_detail_id,
      course_term_id: courseTerm.course_term_id,
      course_delivery_format_id: course_delivery_format_id,
    });

    log.info('Course created successfully', { course });

    // Step 4: Associate Professors
    for (const { professor_id } of professors) {
      await ProfessorCourse.create({
        professor_id,
        course_id: course.course_id,
      });
      log.info('Professor associated with course', { professor_id, courseId: course.course_id });
    }

    return NextResponse.json(
      createSuccessResponse({
        message: 'Course created successfully',
        course,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    log.error('Error fetching courses', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
