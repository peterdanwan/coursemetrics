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
import { Op } from 'sequelize';
import { sequelizeInstance } from '@/database/sequelizeInstance';
import { calculateAverageRating } from '@/utils/funcs';

const processReviews = (data: any) => {
  // Initialize the reviews and quickStats objects
  const result: any = {
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
  data.forEach((review: any) => {
    // Filter out reviews where the ReviewAnswers array for all questions with is_rating=true is empty
    const validReview = review.ReviewQuestions.some((reviewQuestion: any) => {
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
      review.ReviewQuestions.forEach((reviewQuestion: any) => {
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
  } catch (error: unknown) {
    console.error(error);

    log.error('Error fetching reviews for professor', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};

export const POST = async function post_professor_review(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/professors/route.ts' });

  try {
    await connectDB();

    const { user }: any = await getSession();

    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    const userEmail = user.email;

    const url = new URL(req.url);
    const professorId = url.pathname.split('/').pop();

    // Step 1: get professor by id
    const professor = await Professor.findByPk(professorId);

    if (!professor) {
      log.warn('Professor not found', { professorId });
      return NextResponse.json(createErrorResponse(404, 'Professor not found'), { status: 404 });
    }

    // Parse the request body
    const professorReviewData = await req.json();

    if (!professorReviewData) {
      log.error('No professor review data sent in body');
      return NextResponse.json(createErrorResponse(400, 'No data provided in request body'), {
        status: 400,
      });
    }

    log.error(
      {
        professorReviewData,
      },
      'Received professor review data'
    );

    const courseCode = professorReviewData.courseName;
    const [season, year] = professorReviewData.term.split(' ');

    if (!courseCode) {
      return NextResponse.json(createErrorResponse(400, 'Course code not provided'), {
        status: 400,
      });
    }

    // const reviewEvaluator = new ReviewEvaluator();

    // Start a transaction to ensure all operations succeed or fail together
    const transaction = await sequelizeInstance.transaction();

    try {
      const userInstance = await User.findOne<any>({
        where: { email: userEmail },
        transaction,
      });

      const userInstanceJson = userInstance.toJSON();

      // let policiesData = await Policy.findAll<any>();
      // let policies = [];
      // let reviewStatus = 1;

      // if (!policiesData.length) {
      //   log.info('No policies found in the database.');
      //   policies = [];
      // }

      // policies = policiesData.map((policy) => {
      //   return `${policy.policy_name}: ${policy.policy_description}`;
      // });

      // const reviewResponses = getReviewResponses(professorReviewData);

      // const evaluationResult = await reviewEvaluator.evaluateMultipleReviews(
      //   reviewResponses,
      //   policies
      // );

      // if (!evaluationResult.approvedByModel) {
      //   reviewStatus = 3;
      // }

      const course = await Course.findOne<any>({
        where: { course_code: courseCode },
        include: [
          {
            model: CourseTerm,
            where: { season: season, year: year },
          },
        ],
        transaction,
      });

      if (!course) {
        log.error(`Course not found for course code: ${courseCode}`);
        return NextResponse.json(createErrorResponse(404, 'Course not found'), { status: 404 });
      }

      const courseJson = course.toJSON();

      const professorCourse = await ProfessorCourse.findOne<any>({
        where: { course_id: courseJson.course_id, professor_id: professorId },
        transaction,
      });

      const professorCourseJson = professorCourse.toJSON();

      const averageRating: number = calculateAverageRating(professorReviewData?.questions);

      const review = await Review.create(
        {
          review_type_id: 2,
          review_status_id: 1,
          professor_course_id: professorCourseJson.professor_course_id,
          user_id: userInstanceJson.user_id,
          rating: averageRating,
          title: professorReviewData.commentTitle,
          comment: professorReviewData.comment,
          grade: professorReviewData.grade,
        },
        { transaction }
      );

      const reviewJson = review.toJSON();

      // Add questions and answers if provided
      if (professorReviewData.questions && professorReviewData.questions.length > 0) {
        for (const { question_id, answer } of professorReviewData.questions) {
          const reviewQuestion = await ReviewQuestion.create(
            {
              review_id: reviewJson.review_id,
              question_id,
            },
            { transaction }
          );

          const reviewQuestionJson = reviewQuestion.toJSON();

          await ReviewAnswer.create(
            {
              review_question_id: reviewQuestionJson.review_question_id,
              answer,
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      // Log the violation if any at the end when everything is created
      // if (reviewStatus === 3) {
      //   const reason = evaluationResult.reason || 'No specific reason provided.';
      //   await ReviewPolicyViolationLog.create({
      //     review_id: reviewJson.review_id,
      //     policy_id: evaluationResult.violatedPolicyIndex + 1,
      //     reason: reason,
      //   });
      // }

      log.info('Review successfully created and associated with course and professor.');
      return NextResponse.json(
        createSuccessResponse({ message: 'Professor review successfully created.' }),
        { status: 201 }
      );
    } catch (error) {
      await transaction.rollback();
      log.error(`Transaction rolled back due to error, ${error}`);
      return NextResponse.json(
        createErrorResponse(500, 'Failed to create professor review. Transaction rolled back.'),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    log.error('Error posting the professor review', { error });

    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
