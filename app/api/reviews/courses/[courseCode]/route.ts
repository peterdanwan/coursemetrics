// app/api/reviews/courses/[courseCode]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Review from '@/database/models/Review';
import User from '@/database/models/User';
import ReviewQuestion from '@/database/models/ReviewQuestion';
import ReviewAnswer from '@/database/models/ReviewAnswer';
import ProfessorCourse from '@/database/models/ProfessorCourse';
import Professor from '@/database/models/Professor';
import Question from '@/database/models/Question';
import Course from '@/database/models/Course';
import { logger } from '@/utils';
import CourseTerm from '@/database/models/CourseTerm';

export const GET = async function fetch_reviews_by_course_code(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/courses/[courseCode]/route.ts' });

  try {
    await connectDB();

    const { user }: any = await getSession();

    if (!user) {
      log.warn('User not authenticated');
    }

    const url = new URL(req.url);

    const courseCode = url.pathname.split('/').pop();

    let season = req.nextUrl.searchParams.get('season');
    season = String(season).charAt(0).toUpperCase() + String(season).slice(1);
    let year = Number(req.nextUrl.searchParams.get('year'));
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

    const reviews = await Review.findAll({
      where: {
        review_type_id: 1,
      },
      include: [
        {
          model: User,
          attributes: ['user_id', 'full_name', 'email'],
        },
        {
          model: ReviewQuestion,
          include: [
            {
              model: ReviewAnswer,
              attributes: ['answer'],
            },
            {
              model: Question,
              attributes: ['question_text'],
            },
          ],
          attributes: ['review_question_id', 'question_id'],
        },
        {
          model: ProfessorCourse,
          required: true,
          include: [
            {
              model: Professor,
              as: 'Professor',
              attributes: ['first_name', 'last_name'],
            },
            {
              model: Course,
              where: { course_code: courseCode },
              include: [
                {
                  model: CourseTerm,
                  where: courseTermConditions,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!reviews.length) {
      log.info('No reviews found with status 2');
      return NextResponse.json(
        createSuccessResponse({ message: 'No reviews found with status 2' }),
        { status: 200 }
      );
    }

    log.debug(
      {
        reviews,
      },
      'Reviews fetched from DB'
    );

    return NextResponse.json(createSuccessResponse(reviews), { status: 200 });
  } catch (error) {
    console.error(error);

    log.error('Error fetching reviews', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};

export const POST = async function post_review_to_course_code(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/courses/[courseCode]/route.ts' });

  try {
    await connectDB();

    const { user }: any = await getSession();

    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    // Parse the request body
    const courseReviewData = await req.json();

    if (!courseReviewData) {
      log.error('No course review data sent in body');
      return NextResponse.json(createErrorResponse(400, 'No data provided in request body'), {
        status: 400,
      });
    }

    log.error(`Received review data`);
    log.error(courseReviewData);

    // Get the course code from the URL
    const url = new URL(req.url);
    const courseCode = url.pathname.split('/').pop();

    if (!courseCode) {
      return NextResponse.json(createErrorResponse(400, 'Course code not provided'), {
        status: 400,
      });
    }

    // TODO: Add logic to save the review data to the database

    return NextResponse.json(
      createSuccessResponse({ message: 'Course review successfully created.' }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    log.error('Error posting the review', { error });

    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
