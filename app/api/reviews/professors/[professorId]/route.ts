// app/api/reviews/professors/[professorId]/route.ts

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

const processReviews = (data: any) => {
  // Initialize the reviews and quickStats objects
  const result = {
    reviews: [],
    quickStats: {
      difficulty: 0,
      knowledge: 0,
      responsiveness: 0,
      gradingFairness: 0,
      engagement: 0,
      clarity: 0,
      totalReviews: 0, // To track the number of reviews with ratings
    },
  };

  // Iterate through each review in the provided data
  data.forEach((review) => {
    // Filter out reviews where the ReviewAnswers array for all questions with is_rating=true is empty
    const validReview = review.ReviewQuestions.some((reviewQuestion) => {
      // Filter for questions with `is_rating: true` and non-empty answers
      return (
        reviewQuestion.ReviewAnswers.length > 0 && reviewQuestion.ReviewAnswers[0].answer !== null
      );
    });

    if (validReview) {
      result.quickStats.totalReviews++;
      // Add to the reviews array
      result.reviews.push(review);

      // Iterate through the review's questions to calculate the quickStats
      review.ReviewQuestions.forEach((reviewQuestion) => {
        // We only care about questions that have `is_rating: true`
        if (reviewQuestion.Question.is_rating && reviewQuestion.ReviewAnswers.length > 0) {
          const answer = reviewQuestion.ReviewAnswers[0].answer;
          const rating = parseFloat(answer); // Convert the answer to a float (assuming numeric rating)

          if (!isNaN(rating)) {
            switch (reviewQuestion.Question.question_text) {
              case 'Difficulty':
                result.quickStats.difficulty += rating;
                break;
              case 'Knowledge':
                result.quickStats.knowledge += rating;
                break;
              case 'Responsiveness':
                result.quickStats.responsiveness += rating;
                break;
              case 'Grading Fairness':
                result.quickStats.gradingFairness += rating;
                break;
              case 'Engagement':
                result.quickStats.engagement += rating;
                break;
              case 'Clarity':
                result.quickStats.clarity += rating;
                break;
              default:
                break;
            }
          }
        }
      });
    }
  });

  // Calculate averages for quickStats
  if (result.quickStats.totalReviews > 0) {
    result.quickStats.difficulty /= result.quickStats.totalReviews;
    result.quickStats.knowledge /= result.quickStats.totalReviews;
    result.quickStats.responsiveness /= result.quickStats.totalReviews;
    result.quickStats.gradingFairness /= result.quickStats.totalReviews;
    result.quickStats.engagement /= result.quickStats.totalReviews;
    result.quickStats.clarity /= result.quickStats.totalReviews;
  }

  return result;
};

export const GET = async function fetch_reviews_by_professor_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/professors/[professorId]/route.ts' });

  try {
    await connectDB();

    const url = new URL(req.url);

    const professorId = url.pathname.split('/').pop();

    const reviews = await Review.findAll({
      where: {
        review_type_id: 2,
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
              attributes: ['question_text', 'is_rating'],
            },
          ],
          attributes: ['review_question_id'],
        },
        {
          model: ProfessorCourse,
          required: true,
          attributes: ['professor_course_id'],
          include: [
            {
              model: Professor,
              where: {
                professor_id: professorId,
              },
              attributes: ['first_name', 'last_name'],
            },
            {
              model: Course,
              attributes: ['course_code'],
              include: [
                {
                  model: CourseTerm,
                },
              ],
            },
          ],
        },
      ],
    });

    const processedReviews = processReviews(reviews);

    log.error(processedReviews, 'Reviews fetched from DB');

    return NextResponse.json(createSuccessResponse(processedReviews), { status: 200 });
  } catch (error) {
    console.error(error);

    log.error('Error fetching reviews for professor', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
