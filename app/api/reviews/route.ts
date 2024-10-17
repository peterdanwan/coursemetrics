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
import Course from '@/database/models/Course'; // Assuming you have a Course model
import { logger } from '@/utils';

export const GET = async function fetch_reviews(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/route.ts' });

  try {
    await connectDB();

    const { user }: any = await getSession();
    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    log.info(`Fetching reviews for user with email: ${user.email}`);

    const reviews = await Review.findAll({
      // where: {
      //   review_status_id: 2,
      // },
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
          include: [
            {
              model: Professor,
              as: 'Professor',
              attributes: ['first_name', 'last_name'],
            },
            {
              model: Course,
              attributes: ['course_id', 'course_code'],
            },
          ],
          attributes: ['professor_course_id'],
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
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching reviews', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
