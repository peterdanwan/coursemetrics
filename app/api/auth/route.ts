// app/api/auth/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { connectDB } from '@/config/database';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import User from '@/models/User';
import UserProfile from '@/models/UserProfile';
import UserRole from '@/models/UserRole';
import { logger } from '@/utils';

// ===== API ROUTE TO CREATE A NEW USER IF THEY DON'T EXIST ALREADY =====
export const POST = withApiAuthRequired(async function create_user(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'api/auth' });

  try {
    await connectDB();

    const { user }: any = await getSession();

    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    const userEmail = user.email;
    const userName = user.name;
    log.info('Checking for existing user or creating a new one', { email: userEmail });

    // Use findOrCreate to find or create the user
    const [newUser, created] = await User.findOrCreate({
      where: { email: userEmail },
      defaults: {
        full_name: userName,
        email: userEmail,
        role_id: 2, // role_id 2 is for the 'student' role
      },
    });

    if (created) {
      log.info('New user created', { email: userEmail });

      let newUserJson = newUser.toJSON();

      console.log(newUserJson);

      // Create associated user profile
      await UserProfile.create({
        userId: newUserJson.user_id,
        bio: '',
      });

      log.info('User profile created for new user', { email: userEmail });
      return NextResponse.json(createSuccessResponse({ message: 'User processed successfully' }), {
        status: 200,
      });
    } else {
      log.info('User already exists', { email: userEmail });
      return NextResponse.json(createErrorResponse(409, 'User already exists'), { status: 409 });
    }
  } catch (error: unknown) {
    console.error(error);
    log.error('Error processing user', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
