// app/api/questions/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Question from '@/database/models/Question';
import { logger } from '@/utils';

export const dynamic = 'force-dynamic';

// ===== API ROUTE TO FETCH QUESTIONS BASED ON REVIEW TYPE =====
export const GET = async function get_questions(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/questions/route.ts' });

  try {
    // Connect to the database
    await connectDB();

    const url = new URL(req.url);
    const reviewTypeId = url.searchParams.get('type');

    // Validate the reviewTypeId
    if (!reviewTypeId) {
      log.error('Missing review type parameter');
      return NextResponse.json(createErrorResponse(400, 'Missing review type parameter'), {
        status: 400,
      });
    }

    // Fetch questions based on the review type
    const questions = await Question.findAll({
      where: { review_type_id: reviewTypeId },
    });

    log.debug({ questions }, 'Questions fetched from DB');

    return NextResponse.json(createSuccessResponse({ questions }), { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching questions', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
