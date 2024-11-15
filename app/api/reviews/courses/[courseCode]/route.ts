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
    const season = req.nextUrl.searchParams.get('season');
    const year = req.nextUrl.searchParams.get('year');

    let courseTermConditions = {};
    if (season && year) {
      courseTermConditions = {
        season: String(season).charAt(0).toUpperCase() + String(season).slice(1),
        year: Number(year),
      };
    }

    const reviews = await Review.findAll({
      where: {
        review_type_id: 1,

        review_status_id: 2,
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
                  where:
                    Object.keys(courseTermConditions).length > 0 ? courseTermConditions : undefined,
                },
              ],
            },
          ],
        },
      ],
    });

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
