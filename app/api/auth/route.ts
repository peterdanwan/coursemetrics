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
    // Connect to the database
    await connectDB();

    // Get the user session from Auth0
    const { user }: any = await getSession();
    if (!user) {
      log.warn('User not authenticated');
      return NextResponse.json(createErrorResponse(401, 'User not authenticated'), { status: 401 });
    }

    const userEmail = user.email;
    const userName = user.name;
    log.info(`Checking for existing user or creating a new one, email: ${userEmail}`);

    // Fetch the 'student' role from the database (adjust the role name as needed)
    const studentRole = await UserRole.findOne({ where: { role_name: 'student' } });
    if (!studentRole) {
      log.error('Student role not found');
      return NextResponse.json(createErrorResponse(404, 'Student role not found'), { status: 404 });
    }

    let studentRoleJSON = await studentRole.toJSON();

    // Use findOrCreate to find or create the user
    const [userInstance, created] = await User.findOrCreate({
      where: { email: userEmail },
      defaults: {
        full_name: userName,
        email: userEmail,
        role_id: studentRoleJSON.id, // Use the role fetched from the database
      },
    });

    log.info(`User ${created ? 'created for new user' : 'already exists'}`, {
      email: userEmail,
    });

    let userInstanceJSON = await userInstance.toJSON();

    await UserProfile.findOrCreate({
      where: { user_id: userInstanceJSON.user_id },
      defaults: {
        user_id: userInstanceJSON.id,
        bio: '',
      },
    });
    log.info(`User profile ${created ? 'created for new user' : 'already exists'}`, {
      email: userEmail,
    });

    return NextResponse.json(createSuccessResponse({ message: 'User processed successfully' }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error processing user', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
