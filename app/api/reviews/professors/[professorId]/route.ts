// app/api/professorCourses/[professorId]/route.ts

// /api/reviews/professors/[professorId]
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Professor from '@/database/models/Professor';
import Review from '@/database/models/Review';
import User from '@/database/models/User';
import Question from '@/database/models/Question';
import ReviewQuestion from '@/database/models/ReviewQuestion';
import ReviewAnswer from '@/database/models/ReviewAnswer';
import { logger } from '@/utils';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import Course from '@/database/models/Course';
import ProfessorCourse from '@/database/models/ProfessorCourse';
import CourseTerm from '@/database/models/CourseTerm';
import { Op } from 'sequelize';

export const GET = withApiAuthRequired(async function get_reviews_by_professor_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/professorCourses/[professorId]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);
    const professorId = url.pathname.split('/').pop();

    // Step 1: get professor by id
    const professor = await Professor.findByPk(professorId);

    if (!professor) {
      log.warn('Professor not found', { professorId });
      return NextResponse.json(createErrorResponse(404, 'Professor not found'), { status: 404 });
    }

    // Step 2: get all the courses taught by that professor
    const professorCourses = await ProfessorCourse.findAll({
      where: { professor_id: professorId },
      include: {
        model: Course, // Join with the Course model
        attributes: ['course_id', 'course_code', 'course_section'], // Select relevant fields from Course
        include: [
          {
            model: CourseTerm, // Join with the CourseTerm model
            attributes: ['season', 'year'], // Select season and year fields
          },
        ],
      },
    });

    log.debug({ professorCourses }, 'professorCourses teehee');

    // Get a set of all the professorCourseIDs related to professorId
    const professorCourseIds = professorCourses.map((professorCourse: any) => {
      return professorCourse.professor_course_id;
    });

    log.debug({ professorCourseIds }, 'professorCourseIds');

    // Step 3: for each professorCourse
    const reviews = await Review.findAll({
      where: {
        review_type_id: 2, // Reviews about the professor
        review_status_id: 2, // Accepted reviews
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
        // {
        //   model: ProfessorCourse,
        //   required: true,
        //   include: [
        //     {
        //       model: Professor,
        //       as: 'Professor',
        //       attributes: ['first_name', 'last_name'],
        //     },
        //     {
        //       model: Course,
        //       where: { course_code: courseCode },
        //       include: [
        //         {
        //           model: CourseTerm,
        //           where:
        //             Object.keys(courseTermConditions).length > 0 ? courseTermConditions : undefined,
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
    });

    log.debug({ reviews }, 'Reviews Vinh');

    const filteredReviews = professorCourseIds
      .map((professorCourseId: any) =>
        reviews.filter((review: any) => review.professor_course_id === professorCourseId)
      )
      .filter((reviews: any) => reviews.length > 0)
      .flat();

    // const new_filteredReviews = filteredReviews.filter(review => professorCourseIds.has(review.professor_course_id));

    log.debug({ filteredReviews }, 'Filtered Reviews');

    return NextResponse.json(
      createSuccessResponse({ professor, professorCourses, reviews: filteredReviews }),
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(error);
    log.error('Error getting professor by professorId', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
