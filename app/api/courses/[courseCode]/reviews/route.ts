import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { connectDB } from '@/config/database';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import { Course } from '@/models/Course';
import { Review } from '@/models/Review';
import { ReviewAnswer } from '@/models/ReviewAnswer';
import { ReviewQuestion } from '@/models/ReviewQuestion';
import { logger } from '@/utils';

// API ROUTE TO FETCH REVIEWS FOR A COURSE WITH FULL DETAILS AND PAGINATION
export const GET = withApiAuthRequired(async function get_course_reviews(
  req: NextRequest,
  { params }: { params: { courseCode: string } }
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courses/[courseCode]/reviews/route.ts' });

  // try {
  console.log(await connectDB());
  //   const courseCode: string = params.courseCode;

  //   // Validate course code
  //   if (!courseCode) {
  //     log.error('Course code is required');
  //     return NextResponse.json(createErrorResponse(400, 'Course code is required'), {
  //       status: 400,
  //     });
  //   }

  //   // Get query params for pagination (page and limit)
  //   const url = new URL(req.url);
  //   const page = parseInt(url.searchParams.get('page') || '1', 10); // Default page is 1
  //   const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Default limit is 10

  //   log.info('Fetching reviews for course', { courseCode, page, limit });

  //   // Fetch the course to validate its existence
  //   const course = await Course.findOne({ courseCode }).exec();
  //   if (!course) {
  //     log.error('Course not found');
  //     return NextResponse.json(createErrorResponse(404, 'Course not found'), {
  //       status: 404,
  //     });
  //   }

  //   // Fetch reviews for the course with full details and pagination
  //   let reviews = await Review.find({ courseId: course._id })
  //     .populate('userId', 'firstName lastName') // Populate user's first and last name
  //     .populate('reviewTypeId', 'typeName') // Populate review type
  //     .skip((page - 1) * limit)
  //     .limit(limit)
  //     .exec();

  //   const courseReviews = reviews.filter((review) => review.reviewTypeId.typeName === 'Course');

  //   // Get the total number of reviews for pagination metadata
  //   const totalReviews = await Review.countDocuments({ courseId: course._id });

  //   if (!reviews || reviews.length === 0) {
  //     log.warn('No reviews found for this course');
  //     return NextResponse.json(createErrorResponse(404, 'No reviews found for this course'), {
  //       status: 404,
  //     });
  //   }

  //   // Fetch answers and questions for each review
  //   const reviewsWithDetails = await Promise.all(
  //     reviews.map(async (review) => {
  //       // Fetch all questions related to the review
  //       const questions = await ReviewQuestion.find({ reviewID: review._id })
  //         .populate({
  //           path: 'questionID', // Populate the actual question details from the Question model
  //           select: 'questionText', // Only get the question text
  //         })
  //         .exec();

  //       console.log(questions);

  //       // Fetch all answers related to the questions
  //       const answers = await Promise.all(
  //         questions.map(async (question) => {
  //           const answer = await ReviewAnswer.findOne({
  //             reviewQuestionID: question.reviewID,
  //           }).exec();

  //           return {
  //             question: question.questionID.questionText, // Get the actual question text
  //             answer: answer ? answer.answer : 'No answer provided', // Get the answer or a default message
  //           };
  //         })
  //       );

  //       return {
  //         _id: review._id,
  //         comment: review.comment,
  //         rating: review.rating,
  //         reviewer: `${review.userId.firstName} ${review.userId.lastName}`, // Combine first and last name
  //         answers, // Include answers with their related questions
  //       };
  //     })
  //   );

  //   log.debug({ reviewsWithDetails }, 'Reviews fetched from DB');
  //   log.info('Reviews fetched successfully', { courseCode, totalReviews, page, limit });

  //   // Respond with the reviews and pagination metadata
  //   return NextResponse.json(
  //     createSuccessResponse({
  //       course: {
  //         courseCode: course.courseCode,
  //         title: course.title,
  //         description: course.description,
  //       },
  //       reviews: reviewsWithDetails, // Return reviews with all details populated
  //       pagination: {
  //         total: totalReviews,
  //         page,
  //         limit,
  //         totalPages: Math.ceil(totalReviews / limit),
  //       },
  //     }),
  //     {
  //       status: 200,
  //     }
  //   );
  // } catch (error: unknown) {
  //   console.error(error);
  //   log.error('Error fetching reviews', { error });

  //   if (error instanceof Error) {
  //     return NextResponse.json(createErrorResponse(500, error.message), {
  //       status: 500,
  //     });
  //   }

  //   return NextResponse.json(
  //     createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
  //     { status: 500 }
  //   );
  // }
});
