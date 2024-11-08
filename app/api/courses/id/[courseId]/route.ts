// app/api/courses/id/[courseId]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Course from '@/database/models/Course';
import { logger } from '@/utils';
import CourseDetail from '@/database/models/CourseDetail';
import CourseTerm from '@/database/models/CourseTerm';
import ProfessorCourse from '@/database/models/ProfessorCourse';
import Professor from '@/database/models/Professor';
import CourseDeliveryFormat from '@/database/models/CourseDeliveryFormat';

// ===== API ROUTE TO FETCH COURSE BY COURSE ID =====
export const GET = withApiAuthRequired(async function get_course_by_course_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/id/[courseId]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const courseId = Number(url.pathname.split('/').pop()); // Get the course_id from the URL

    if (isNaN(courseId)) {
      return NextResponse.json(createErrorResponse(400, 'Invalid course_id'), { status: 400 });
    }

    log.info(`Fetching course with ID: ${courseId}`);

    const course = await Course.findOne({
      where: { course_id: courseId },
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
        {
          model: ProfessorCourse,
          include: [
            {
              model: Professor,
              attributes: ['professor_id', 'first_name', 'last_name'],
            },
          ],
        },
      ],
    });

    if (!course) {
      log.warn('Course not found', { courseId });
      return NextResponse.json(createErrorResponse(404, 'Course not found'), { status: 404 });
    }

    log.debug({ course }, 'Course fetched from DB');
    log.info('Course fetched successfully');

    return NextResponse.json(createSuccessResponse({ course }), { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching course by ID', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});

// ===== API ROUTE TO UPDATE AN EXISTING COURSE =====
export const PATCH = withApiAuthRequired(async function update_course(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/id/[courseId]/route.ts' });

  // Log the incoming request for debugging and auditing
  log.info('Received PATCH request to update course', { body: req.body });
  const body = await req.json();

  const {
    course_id, // Assuming you are passing the course ID in the body for updating
    course_code,
    name,
    description,
    course_section,
    termSeason,
    termYear,
    deliveryFormatId,
    professorIds, // Array of professor IDs to be associated
  } = body;

  // Check if all required fields are provided
  if (
    !course_id ||
    !course_code ||
    !name ||
    !description ||
    !course_section ||
    !termSeason ||
    !termYear ||
    !deliveryFormatId ||
    !professorIds
  ) {
    return NextResponse.json(createErrorResponse(400, 'Missing required fields'), { status: 400 });
  }

  try {
    // Step 1: Find the existing course by course_id
    const course = await Course.findByPk(course_id);
    if (!course) {
      return NextResponse.json(createErrorResponse(404, 'Course not found'), { status: 404 });
    }
    log.info('Course found', { course });

    // Step 2: Find or update CourseDetail
    const [courseDetail, created] = await CourseDetail.findOrCreate({
      where: {
        course_name: name,
        course_description: description,
      },
    });
    log.info('CourseDetail found or created', { courseDetail });

    // Step 3: Find or update CourseTerm
    const [courseTerm] = await CourseTerm.findOrCreate({
      where: {
        season: termSeason,
        year: termYear,
      },
    });
    log.info('CourseTerm found or created', { courseTerm });

    // Step 4: Update the Course model with the new data
    await course.update({
      course_code,
      course_section,
      course_detail_id: courseDetail.course_detail_id,
      course_term_id: courseTerm.course_term_id,
      course_delivery_format_id: deliveryFormatId,
    });
    log.info('Course updated successfully', { course });

    // Step 5: Update the Professor associations (if professorIds have changed)
    await ProfessorCourse.destroy({ where: { course_id: course_id } }); // Remove all current associations
    for (const professorId of professorIds) {
      await ProfessorCourse.create({
        professor_id: professorId,
        course_id: course.course_id,
      });
      log.info('Professor associated with updated course', {
        professorId,
        courseId: course.course_id,
      });
    }

    return NextResponse.json(
      createSuccessResponse({
        message: 'Course updated successfully',
        course,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    log.error('Error updating course', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
