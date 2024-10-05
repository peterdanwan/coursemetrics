// app/api/professors/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { sequelize, connectDB } from '@/config/database';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Professor from '@/models/Professor';
import { logger } from '@/utils';
import { createReadStream } from 'fs';

// ===== API ROUTE TO FETCH ALL PROFESSORS =====
export const GET = withApiAuthRequired(async function get_professors(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/professors/route.ts' });

  try {
    // Connect to the database
    await connectDB();
    const url = new URL(req.url);

    const queryParams: { page: string; limit: string } = {
      // E.g.,
      // localhost:3000/professors?page=1&limit=10
      // localhost:3000/professors?page=12
      // localhost:3000/professors?limit=3
      // localhost:3000/professors?limit=2&page=3
      page: url.searchParams.get('page') || '1',
      limit: url.searchParams.get('limit') || '10',
    };

    // Ref Doc: https://www.shecodes.io/athena/60744-what-is-parseint-in-javascript#
    const pageNumber: number = parseInt(queryParams.page, 10);
    const limitNumber: number = parseInt(queryParams.limit, 10);

    // Validate pagination parameters
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      log.error('Invalid pagination parameters', { pageNumber, limitNumber });
      return NextResponse.json(createErrorResponse(400, 'Invalid pagination parameters'), {
        status: 400,
      });
    }

    // Calculate the number of documents to skip
    const offsetNumber: number = (pageNumber - 1) * limitNumber;

    log.info('Fetching professors', { pageNumber, limitNumber });

    // Fetch the professors and count the total number of records
    const professors = await Professor.findAll({ limit: limitNumber, offset: offsetNumber });
    // .skip(skip)
    // .limit(limitNumber)
    // .populate('professorId')
    // .exec();

    console.log(professors.every((professor) => professor instanceof Professor));

    console.log(professors);

    const totalProfessors: number = await Professor.count();
    const totalPages: number = Math.ceil(totalProfessors / limitNumber);

    log.debug(
      {
        professors,
        totalPages,
        currentPage: pageNumber,
        totalProfessors,
      },
      'Professors fetched from DB'
    );

    log.info('Professors fetched successfully', {
      totalPages,
      currentPage: pageNumber,
      totalProfessors,
    });

    return NextResponse.json(
      createSuccessResponse({
        professors,
        totalPages,
        currentPage: pageNumber,
        totalProfessors,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching professors', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
});
