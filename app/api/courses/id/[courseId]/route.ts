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
  log.info('Received PATCH request to update course', { body: req.body });
  const body = await req.json();

  const {
    course_id,
    course_code,
    name,
    description,
    course_section,
    termSeason,
    termYear,
    deliveryFormatId,
    professorIds,
  } = body;

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
    const course = await Course.findByPk(course_id);
    if (!course) {
      return NextResponse.json(createErrorResponse(404, 'Course not found'), { status: 404 });
    }
    log.info('Course found', { course });

    const [courseDetail] = await CourseDetail.findOrCreate({
      where: { course_name: name, course_description: description },
    });
    log.info('CourseDetail found or created', { courseDetail });

    const [courseTerm] = await CourseTerm.findOrCreate({
      where: { season: termSeason, year: termYear },
    });
    log.info('CourseTerm found or created', { courseTerm });

    await course.update({
      course_code,
      course_section,
      course_detail_id: courseDetail.course_detail_id,
      course_term_id: courseTerm.course_term_id,
    });

    const courseDeliveryFormat = await CourseDeliveryFormat.findByPk(deliveryFormatId);
    if (!courseDeliveryFormat) {
      return NextResponse.json(createErrorResponse(400, 'Invalid delivery format ID'), {
        status: 400,
      });
    }

    await course.update({ course_delivery_format_id: deliveryFormatId });
    log.info('CourseDeliveryFormat associated with course', { courseDeliveryFormat });

    await ProfessorCourse.destroy({ where: { course_id: course_id } });
    await ProfessorCourse.bulkCreate(
      professorIds.map((professorId: number) => ({
        course_id: course_id,
        professor_id: professorId,
      }))
    );
    log.info('Professors associated with course', { professorIds });

    return NextResponse.json({ message: 'Course updated successfully', course }, { status: 200 });
  } catch (error) {
    log.error('Error updating course', { error });
    return NextResponse.json(createErrorResponse(500, 'Internal server error'), { status: 500 });
  }
});

// ===== API ROUTE TO DELETE COURSE BY COURSE ID =====
export const DELETE = withApiAuthRequired(async function delete_course_by_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/id/[courseId]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const courseId = url.pathname.split('/').pop();

    const course = await Course.findByPk(courseId);

    if (!course) {
      log.warn('Course not found', { courseId });
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

    log.info('Course deleted successfully', { courseId });
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
