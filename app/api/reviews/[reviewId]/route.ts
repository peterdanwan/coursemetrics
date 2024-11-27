// app/api/reviews/[reviewId]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { getSession } from '@auth0/nextjs-auth0';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Review from '@/database/models/Review';
import User from '@/database/models/User';
import ReviewQuestion from '@/database/models/ReviewQuestion';
import ReviewAnswer from '@/database/models/ReviewAnswer';
import ReviewStatus from '@/database/models/ReviewStatus';
import ProfessorCourse from '@/database/models/ProfessorCourse';
import Professor from '@/database/models/Professor';
import Question from '@/database/models/Question';
import Course from '@/database/models/Course';
import { logger } from '@/utils';
import CourseTerm from '@/database/models/CourseTerm';
import ReviewPolicyViolationLog from '@/database/models/ReviewPolicyViolationLog';
import Policy from '@/database/models/Policy';
// @ts-ignore
import redisClient from '@/database/redisInstance';

export const dynamic = 'force-dynamic';

export const GET = async function get_review_by_id(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/[reviewId]/route.ts' });

  // Get the review ID from the URL params
  const reviewId = req.nextUrl.pathname.split('/').pop();
  console.log('Review ID API Route:', reviewId);

  try {
    await connectDB();

    const { user }: any = await getSession();
    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    log.info(`Fetching reviews for user with email: ${user.email}`);

    // Fetch the review by its ID
    const review = await Review.findOne({
      where: { review_id: reviewId },
      include: [
        { model: User, attributes: ['user_id', 'full_name', 'email'] },
        {
          model: ReviewQuestion,
          include: [
            { model: ReviewAnswer, attributes: ['answer'] },
            { model: Question, attributes: ['question_text'] },
          ],
          attributes: ['review_question_id', 'question_id'],
          order: [['question_id', 'ASC']],
        },
        {
          model: ReviewPolicyViolationLog,
          include: [{ model: Policy, attributes: ['policy_name', 'policy_description'] }],
        },
        {
          model: ProfessorCourse,
          include: [
            { model: Professor, as: 'Professor', attributes: ['first_name', 'last_name'] },
            { model: Course, include: [{ model: CourseTerm }] },
          ],
          attributes: ['professor_course_id'],
        },
      ],
    });

    if (!review) {
      log.info('Review not found');
      return NextResponse.json(createErrorResponse(404, 'Review not found'), { status: 404 });
    }

    console.log('Review Found:', review);

    return NextResponse.json(createSuccessResponse(review), { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching review by ID', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};

// This PUT API is for the admin to update the review status (approve or reject)
export const PUT = async function update_review_by_id(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/[reviewId]/route.ts' });

  // Get the review ID from the URL params
  const reviewId = req.nextUrl.pathname.split('/').pop();

  try {
    await connectDB();

    const { user }: any = await getSession();
    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    log.info(`Updating review status for user with email: ${user.email}`);

    // Parse the incoming request body (should contain review_status_id and selected policies)
    const { review_status_id, selectedPolicies } = await req.json();

    if (![2, 3].includes(review_status_id)) {
      return NextResponse.json(createErrorResponse(400, 'Invalid review status'), { status: 400 });
    }

    // Fetch the review by its ID
    const review = await Review.findOne({
      where: {
        review_id: reviewId,
      },
      include: [
        {
          model: ReviewStatus,
          attributes: ['review_status_id'],
        },
        {
          model: ProfessorCourse,
          include: [
            {
              model: Course,
              attributes: ['course_code'],
            },
          ],
        },
      ],
    });

    if (!review) {
      log.info('Review not found');
      return NextResponse.json(createErrorResponse(404, 'Review not found'), { status: 404 });
    }

    const reviewJSON = review.toJSON();
    const courseCode = reviewJSON.ProfessorCourse.Course.course_code;

    // Update the review status (either approved or rejected)
    review.setDataValue('review_status_id', review_status_id); // review.review_status_id <-- Property 'review_status_id' does not exist on type 'Review'.
    await review.save();

    // Handle Policy Violation Logs (add/update them)
    if (selectedPolicies && selectedPolicies.length > 0) {
      // If there are selected policies, we should add/update the violation logs

      // First, delete the existing violations for this review (if any)
      await ReviewPolicyViolationLog.destroy({
        where: { review_id: reviewId },
      });

      // Add new violations
      const policyLogs = selectedPolicies.map((policyId: number) => ({
        review_id: reviewId,
        policy_id: policyId,
      }));

      await ReviewPolicyViolationLog.bulkCreate(policyLogs);
    }

    // Delete the cached response if we are updating the review's status
    // The GET route will get updated tags for all reviews
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
      console.error('Error deleting keys:', error);
    }

    // Return the updated review data (optional)
    return NextResponse.json(createSuccessResponse({ review_status_id, selectedPolicies }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error updating review by ID', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};

export const DELETE = withApiAuthRequired(async function delete_review_by_review_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/reviews/[reviewId]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const reviewId = url.pathname.split('/').pop();

    // Fetch the review by its ID
    const review = await Review.findOne({
      where: {
        review_id: reviewId,
      },
      include: [
        {
          model: ProfessorCourse,
          include: [
            {
              model: Course,
              attributes: ['course_code'],
            },
          ],
        },
      ],
    });

    if (!review) {
      log.warn('Review not found', { reviewId: reviewId });
      return NextResponse.json(createErrorResponse(404, 'Review not found'), { status: 404 });
    }
    const reviewJSON = review.toJSON();
    const courseCode = reviewJSON.ProfessorCourse.Course.course_code;

    await review.destroy();

    // Delete the cached response if we are updating the review's status
    // The GET route will get updated tags for all reviews
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
      console.error('Error deleting keys:', error);
    }

    log.info('Review deleted successfully', { reviewId: reviewId });
    return NextResponse.json(createSuccessResponse({ message: 'Review deleted successfully' }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error deleting review by review id', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
