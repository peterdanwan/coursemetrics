// app/api/reviews/route.ts

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
import CourseTerm from '@/database/models/CourseTerm';

export const GET = async function fetch_reviews(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/route.ts' });

  try {
    await connectDB();

    const reviews = await Review.findAll({
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
              include: [
                {
                  model: CourseTerm,
                  attributes: ['season', 'year'],
                },
              ],
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

export const POST = async function create_review(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/route.ts' });

  try {
    await connectDB();

    // Authenticate the user
    const { user }: any = await getSession();
    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    log.info(`Creating a new review for user with email: ${user.email}`);

    // Parse the incoming request body
    const body = await req.json();
    const { professorCourseId, rating, comments, questionsAndAnswers } = body;

    // Basic validation for required fields
    if (!professorCourseId || !rating) {
      log.warn('Missing required fields: professorCourseId or rating');
      return NextResponse.json(
        createErrorResponse(400, 'professorCourseId and rating are required'),
        { status: 400 }
      );
    }

    // Find the user in the database
    const userRecord = await User.findOne({ where: { email: user.email } });
    if (!userRecord) {
      log.error('User record not found');
      return NextResponse.json(createErrorResponse(404, 'User not found'), { status: 404 });
    }

    // Find the ProfessorCourse association
    const professorCourse = await ProfessorCourse.findByPk(professorCourseId);
    if (!professorCourse) {
      log.error('ProfessorCourse record not found');
      return NextResponse.json(createErrorResponse(404, 'ProfessorCourse not found'), {
        status: 404,
      });
    }

    // Create the new review
    const review = await Review.create({
      user_id: userRecord.user_id,
      professor_course_id: professorCourseId,
      rating,
      comments,
    });

    // If there are questions and answers, add them as well
    if (questionsAndAnswers && questionsAndAnswers.length > 0) {
      for (const { questionId, answer } of questionsAndAnswers) {
        await review.createReviewQuestion(
          {
            question_id: questionId,
            reviewAnswers: [{ answer }],
          },
          {
            include: [ReviewAnswer], // Assuming reviewAnswers association is correctly set up
          }
        );
      }
    }

    log.info('Review created successfully', { reviewId: review.review_id });

    return NextResponse.json(
      createSuccessResponse({ message: 'Review created successfully', review }),
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(error);
    log.error('Error creating review', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
