import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import connectDB from '@/config/database';

// Ref Doc: https://nextjs.org/docs/pages/building-your-application/routing/api-routes

// Handle the GET request to fetch all courses
export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await connectDB();

    return NextResponse.json(
      { message: 'Courses fetched successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Courses not fetched successfully' },
      { status: 500 }
    );
  }
};
