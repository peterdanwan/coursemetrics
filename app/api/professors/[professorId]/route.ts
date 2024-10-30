// app/api/professors/[professorId]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Professor from '@/database/models/Professor';
import { logger } from '@/utils';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export const DELETE = withApiAuthRequired(async function delete_professor_by_professor_id(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/professors/[professorId]/route.ts' });

  try {
    await connectDB();
    const url = new URL(req.url);

    const professorId = url.pathname.split('/').pop();

    const professor = await Professor.findByPk(professorId);

    if (!professor) {
      log.warn('Professor not found', { professorId });
      return NextResponse.json(createErrorResponse(404, 'Professor not found'), { status: 404 });
    }

    await professor.destroy();

    log.info('Professor deleted successfully', { professorId });
    return NextResponse.json(createSuccessResponse({ message: 'Professor deleted successfully' }), {
      status: 200,
    });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error deleting professor by professorId', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
