// app/api/auth/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import connectDB from '@/config/database';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import { User } from '@/models/User';
import { UserProfile } from '@/models/UserProfile';
import { UserRole } from '@/models/UserRole';
import { logger } from '@/utils';

// ===== API ROUTE TO CREATE A NEW USER IF THEY DON'T EXIST ALREADY =====
export const POST = withApiAuthRequired(async function create_user(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'api/auth' });

  try {
    await connectDB();

    const res = new NextResponse();
    const { user }: any = await getSession(req, res);

    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    const userEmail = user.email;
    log.info('Checking for existing user', { email: userEmail });
    let existingUser = await User.findOne({ email: userEmail });

    // Create new user if they don't exist
    if (!existingUser) {
      log.info('Creating new user', { email: userEmail });

      // Fetch the default role (student)
      const defaultRole = await UserRole.findOne({ roleName: 'student' });

      const newUser = new User({
        firstName: user.given_name,
        lastName: user.family_name,
        email: userEmail,
        role: defaultRole ? defaultRole._id : null,
      });

      existingUser = await newUser.save();

      // Create associated user profile
      const newUserProfile = new UserProfile({
        userId: existingUser._id,
        biography: '',
      });

      await newUserProfile.save();
      log.info('New user and profile created', { email: userEmail });
    } else {
      log.info('User already exists', { email: userEmail });
      return NextResponse.json(createErrorResponse(409, 'User already exists'), { status: 409 });
    }

    log.info('User processed successfully', { email: userEmail });
    return NextResponse.json(createSuccessResponse({ message: 'User processed successfully' }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error creating user', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
