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
import Policy from '@/database/models/Policy';
import { logger } from '@/utils';
import CourseTerm from '@/database/models/CourseTerm';
import ReviewPolicyViolationLog from '@/database/models/ReviewPolicyViolationLog';
import {
  calculateAverageRating,
  processReviews,
  getFirstTenComments,
  getReviewResponses,
} from '@/utils/funcs';
// @ts-ignore
import redisClient from '@/database/redisInstance';
import { ReviewEvaluator } from '@/utils/ai';

export const dynamic = 'force-dynamic';

export const GET = async function fetch_reviews_by_course_code(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/courses/[courseCode]/route.ts' });

  try {
    await connectDB();

    const url = new URL(req.url);
    const courseCode = url.pathname.split('/').pop()!;
    const season = req.nextUrl.searchParams.get('season');
    const year = req.nextUrl.searchParams.get('year');

    let courseTermConditions: Record<string, any> = {};
    if (season && year) {
      courseTermConditions = {
        season: String(season).charAt(0).toUpperCase() + String(season).slice(1),
        year: Number(year),
      };
    }

    /* Get the cached review data + tags for a particular course term */
    // @ts-ignore
    const cachedData = await redisClient.get(`reviews:${courseCode}:${season}:${year}`);

    let reviews: any[] = [];
    let tags: string[] = [];

    reviews = await Review.findAll({
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
              attributes: ['question_id', 'question_text', 'is_rating'],
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
              attributes: ['course_code', 'course_section'],
            },
          ],
        },
      ],
    });

    const processedReviews = processReviews(reviews);

    if (cachedData) {
      const cachedDataJson = JSON.parse(cachedData);
      tags = cachedDataJson.tags;
    } else {
      const reviewEvaluator = new ReviewEvaluator();

      if (reviews.length > 0) {
        const tagResponse: { tags: string[] } = await reviewEvaluator.generateTags(
          getFirstTenComments(processedReviews.reviews)
        );

        tags = tagResponse.tags.length > 5 ? tagResponse.tags.slice(0, 5) : tagResponse.tags;

        // @ts-ignore
        await redisClient.set(`reviews:${courseCode}:${season}:${year}`, JSON.stringify({ tags }));
      }
    }

    console.log(reviews);

    log.info('Reviews and tags fetched successfully');
    return NextResponse.json(createSuccessResponse({ reviewContent: processedReviews, tags }), {
      status: 200,
    });
  } catch (error) {
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
    const courseReviewData = await req.json();

    if (!courseReviewData) {
      log.error('No course review data sent in body');
      return NextResponse.json(createErrorResponse(400, 'No data provided in request body'), {
        status: 400,
      });
    }

    const professorId = parseInt(courseReviewData.professorId);
    const courseCode = courseReviewData.courseName;
    const [season, year] = courseReviewData.term.split(' ');

    if (!professorId) {
      return NextResponse.json(createErrorResponse(400, 'Professor not provided'), {
        status: 400,
      });
    }

    if (!courseCode) {
      return NextResponse.json(createErrorResponse(400, 'Course code not provided'), {
        status: 400,
      });
    }

    if (!season) {
      return NextResponse.json(createErrorResponse(400, 'Season not provided'), {
        status: 400,
      });
    }

    if (!year) {
      return NextResponse.json(createErrorResponse(400, 'Year not provided'), {
        status: 400,
      });
    }

    // Create a placeholder that stores the review created so that it can be reused later in the AI scanning part
    let postedReviewData: any = null;

    const postTransaction = await sequelizeInstance.transaction();

    try {
      const userInstance = await User.findOne<any>({
        where: { email: userEmail },
        transaction: postTransaction,
      });

      const userInstanceJson = userInstance.toJSON();

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

      const averageRating: number = Math.floor(calculateAverageRating(courseReviewData?.questions));

      const review = await Review.create(
        {
          review_type_id: 1,
          review_status_id: 1, // Review is set to the "pending" state by default waiting for the AI to approve/flag it
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

      postedReviewData = reviewJson;

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

      const reviewEvaluationTransaction = await sequelizeInstance.transaction();

      const reviewEvaluator = new ReviewEvaluator();

      // Get the review that was recently posted => postedReviewData
      // Get all the policies that we have from the database
      let policiesData = await Policy.findAll<any>();
      let policies = [];

      if (!policiesData.length) {
        log.info('No policies found in the database.');
        policies = [];
      }

      policies = policiesData.map((policy) => {
        return `${policy.policy_name}: ${policy.policy_description}`;
      });

      const reviewResponses = getReviewResponses(courseReviewData);

      const evaluationResult = await reviewEvaluator.evaluateMultipleReviews(
        reviewResponses,
        policies
      );

      if (evaluationResult.approvedByModel) {
        // Update the review that we just posted and change the status ID to pending => 2
        await Review.update(
          { review_status_id: 2 },
          {
            where: {
              review_id: postedReviewData.review_id,
            },
            transaction: reviewEvaluationTransaction,
          }
        );
      } else {
        // Log the violation
        const reason = evaluationResult.reason || 'No specific reason provided.';
        await ReviewPolicyViolationLog.create({
          review_id: postedReviewData.review_id,
          policy_id: evaluationResult.violatedPolicyIndex + 1 || 1,
          reason,
        });
      }

      await reviewEvaluationTransaction.commit();

      // START REDIS LOGIC: DELETE PREVIOUSLY CACHED DATA
      const redisKeyPattern = `reviews:${courseCode}:*`; // This pattern will match all keys starting with 'reviews:{courseCode}:'

      try {
        // @ts-ignore
        const keys: string[] = await redisClient.keys(redisKeyPattern);

        if (keys.length > 0) {
          // @ts-ignore
          await redisClient.del(...keys);
          console.log(`Deleted ${keys.length} keys starting with ${redisKeyPattern}`);
        } else {
          console.log('No keys found to delete.');
        }
      } catch (error) {
        log.error('Error deleting keys:', error);
      }

      // END REDIS LOGIC: DELETE PREVIOUSLY CACHED DATA

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
    log.error('Error posting the course review', { error });

    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
