// app/api/auth/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import User from '@/database/models/User';
import UserProfile from '@/database/models/UserProfile';
import { logger } from '@/utils';
import Review from '@/database/models/Review';
import ProfessorCourse from '@/database/models/ProfessorCourse';
import Course from '@/database/models/Course';
import CourseTerm from '@/database/models/CourseTerm';
import Professor from '@/database/models/Professor';
import { sequelizeInstance } from '@/database/sequelizeInstance';

// ===== API ROUTE TO CREATE A NEW USER IF THEY DON'T EXIST ALREADY =====
export const POST = async function create_user(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/auth/route.ts' });

  try {
    // Connect to the database
    await connectDB();

    // Get the user session from Auth0
    const { user }: any = await getSession();
    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    // Extract the user credentials returned from Auth0
    const userEmail = user.email;
    const userName = user.name;
    log.info(`Checking for existing user or creating a new one, email: ${userEmail}`);

    // Start a transaction to ensure all operations succeed or fail together
    const transaction = await sequelizeInstance.transaction();

    try {
      // Use findOrCreate to find or create the user
      const [userInstance, created] = await User.findOrCreate({
        where: { email: userEmail },
        defaults: {
          full_name: userName,
          email: userEmail,
        },
        transaction,
      });

      log.info(`User ${created ? 'created for new user' : 'already exists'}`, {
        email: userEmail,
      });

      let userInstanceJSON = await userInstance.toJSON();

      await UserProfile.findOrCreate({
        where: { user_id: userInstanceJSON.user_id },
        defaults: {
          user_id: userInstanceJSON.id,
        },
        transaction,
      });

      await transaction.commit();

      log.info(`User profile ${created ? 'created for new user' : 'already exists'}`, {
        email: userEmail,
      });

      return NextResponse.json(createSuccessResponse({ message: 'User processed successfully' }), {
        status: 200,
      });
    } catch (error) {
      await transaction.rollback();
      log.error(`Transaction rolled back due to error, ${error}`);
      return NextResponse.json(
        createErrorResponse(500, 'Failed to create course review. Transaction rolled back.'),
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error(error);
    log.error('Error processing user', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};

// ===== API ROUTE TO GET USER INFORMATION =====
export const GET = async function get_user(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/auth/route.ts' });

  try {
    // Connect to the database
    await connectDB();

    // Get the user session from Auth0
    const { user }: any = await getSession();
    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    // Find the user by email
    const userInstance = await User.findOne({
      where: { email: user.email },
      include: [
        {
          model: UserProfile,
          attributes: ['user_id'],
        },
        {
          model: Review,
          attributes: [
            'review_id',
            'review_type_id',
            'review_status_id',
            'professor_course_id',
            'user_id',
            'rating',
            'title',
            'comment',
            'grade',
          ],
          include: [
            {
              model: ProfessorCourse,
              attributes: ['professor_course_id'],
              include: [
                {
                  model: Professor,
                  attributes: ['professor_id', 'first_name', 'last_name'],
                },
                {
                  model: Course,
                  attributes: ['course_code', 'course_section'],
                  include: [
                    {
                      model: CourseTerm,
                      attributes: ['season', 'year'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!userInstance) {
      log.warn('User not found in database', { email: user.email });
      return NextResponse.json(createErrorResponse(404, 'User not found'), { status: 404 });
    }

    log.info('User retrieved successfully', { email: user.email });

    return NextResponse.json(
      createSuccessResponse({
        user: userInstance,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    log.error('Error retrieving user', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side error occurred.'),
      { status: 500 }
    );
  }
};
