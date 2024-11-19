// app/api/reviews/courses/[courseCode]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import { sequelizeInstance } from '@/database/sequelizeInstance';
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
import { calculateAverageRating } from '@/utils/funcs';

const processReviews = (data: any) => {
  // Initialize the reviews and quickStats objects
  const result: any = {
    reviews: [],
    quickStats: {
      difficulty: 0,
      courseStructure: 0,
      courseLoad: 0,
      evaluationFairness: 0,
      contentQuality: 0,
      materialRelevance: 0,
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
              case 'Course Structure':
                result.quickStats.courseStructure += rating;
                break;
              case 'Course Load':
                result.quickStats.courseLoad += rating;
                break;
              case 'Evaluation Fairness':
                result.quickStats.evaluationFairness += rating;
                break;
              case 'Content Quality':
                result.quickStats.contentQuality += rating;
                break;
              case 'Material Relevance':
                result.quickStats.materialRelevance += rating;
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
    result.quickStats.courseStructure /= result.quickStats.totalReviews;
    result.quickStats.courseLoad /= result.quickStats.totalReviews;
    result.quickStats.evaluationFairness /= result.quickStats.totalReviews;
    result.quickStats.contentQuality /= result.quickStats.totalReviews;
    result.quickStats.materialRelevance /= result.quickStats.totalReviews;
  }

  return result;
};

export const GET = async function fetch_reviews_by_course_code(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/courses/[courseCode]/route.ts' });

  try {
    await connectDB();

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

    const processedReviews = processReviews(reviews);

    log.error(processedReviews, 'Reviews fetched from DB');

    return NextResponse.json(createSuccessResponse(processedReviews), { status: 200 });
  } catch (error) {
    console.error(error);

    log.error('Error fetching reviews', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};

export const POST = async function post_course_review(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/courses/route.ts' });

  try {
    await connectDB();

    const { user }: any = await getSession();

    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    const userEmail = user.email;

    // Parse the request body
    const courseReviewData = await req.json();

    if (!courseReviewData) {
      log.error('No course review data sent in body');
      return NextResponse.json(createErrorResponse(400, 'No data provided in request body'), {
        status: 400,
      });
    }

    log.error(
      {
        courseReviewData,
      },
      'Received course review data'
    );

    const professorId = parseInt(courseReviewData.professorId);
    const courseCode = courseReviewData.courseName;
    const [season, year] = courseReviewData.term.split(' ');

    if (!courseCode) {
      return NextResponse.json(createErrorResponse(400, 'Course code not provided'), {
        status: 400,
      });
    }

    //const reviewEvaluator = new ReviewEvaluator();

    // Start a transaction to ensure all operations succeed or fail together
    const postTransaction = await sequelizeInstance.transaction();

    try {
      const userInstance = await User.findOne<any>({
        where: { email: userEmail },
        transaction: postTransaction,
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

      // const reviewResponses = getReviewResponses(courseReviewData);

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
        transaction: postTransaction,
      });

      if (!course) {
        log.error(`Course not found for course code: ${courseCode}`);
        return NextResponse.json(createErrorResponse(404, 'Course not found'), { status: 404 });
      }

      const courseJson = course.toJSON();

      const professorCourse = await ProfessorCourse.findOne<any>({
        where: { course_id: courseJson.course_id, professor_id: professorId },
        transaction: postTransaction,
      });

      const professorCourseJson = professorCourse.toJSON();

      const averageRating: number = calculateAverageRating(courseReviewData?.questions);

      // Create the primary review entry
      const review = await Review.create(
        {
          review_type_id: 1,
          review_status_id: 1,
          professor_course_id: professorCourseJson.professor_course_id,
          user_id: userInstanceJson.user_id,
          rating: averageRating,
          title: courseReviewData.commentTitle,
          comment: courseReviewData.comment,
          grade: courseReviewData.grade,
        },
        { transaction: postTransaction }
      );

      const reviewJson = review.toJSON();

      // Add questions and answers if provided
      if (courseReviewData.questions && courseReviewData.questions.length > 0) {
        for (const { question_id, answer } of courseReviewData.questions) {
          const reviewQuestion = await ReviewQuestion.create(
            {
              review_id: reviewJson.review_id,
              question_id,
            },
            { transaction: postTransaction }
          );

          const reviewQuestionJson = reviewQuestion.toJSON();

          await ReviewAnswer.create(
            {
              review_question_id: reviewQuestionJson.review_question_id,
              answer,
            },
            { transaction: postTransaction }
          );
        }
      }

      await postTransaction.commit();

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
        createSuccessResponse({ message: 'Course review successfully created.' }),
        { status: 201 }
      );
    } catch (error) {
      await postTransaction.rollback();
      log.error(`Transaction rolled back due to error, ${error}`);
      return NextResponse.json(
        createErrorResponse(500, 'Failed to create course review. Transaction rolled back.'),
        { status: 500 }
      );
    }

    // Start another transaction with regards to changing the review_status_id
    // const aiTransaction = await sequelizeInstance.transaction();
  } catch (error) {
    console.error(error);
    log.error('Error posting the course review', { error });

    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
