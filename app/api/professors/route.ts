// app/api/professors/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import Professor from '@/database/models/Professor';
import { logger } from '@/utils';

// ===== API ROUTE TO FETCH ALL PROFESSORS (available to all users) =====
export const GET = async function get_professors(req: NextRequest): Promise<NextResponse> {
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
    // const pageNumber: number = parseInt(queryParams.page, 10);
    // const limitNumber: number = parseInt(queryParams.limit, 10);

    // Validate pagination parameters
    // if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
    //   log.error('Invalid pagination parameters', { pageNumber, limitNumber });
    //   return NextResponse.json(createErrorResponse(400, 'Invalid pagination parameters'), {
    //     status: 400,
    //   });
    // }

    // Calculate the number of documents to skip
    // const offsetNumber: number = (pageNumber - 1) * limitNumber;

    // log.info('Fetching professors', { pageNumber, limitNumber });

    // Fetch the professors and count the total number of records
    const professors = await Professor.findAll({
      // limit: limitNumber,
      // offset: offsetNumber
    });

    console.log(professors);

    const totalProfessors: number = await Professor.count();
    // const totalPages: number = Math.ceil(totalProfessors / limitNumber);

    log.debug(
      {
        professors,
        // totalPages,
        // currentPage: pageNumber,
        totalProfessors,
      },
      'Professors fetched from DB'
    );

    log.info('Professors fetched successfully', {
      // totalPages,
      // currentPage: pageNumber,
      totalProfessors,
    });

    return NextResponse.json(
      createSuccessResponse({
        professors,
        // totalPages,
        // currentPage: pageNumber,
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
};

// ===== API ROUTE TO CREATE Professor =====
export const POST = async function add_professor(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/professors/route.ts' });

  try {
    const body = await req.json();

    const { first_name, last_name, is_duplicate } = body;

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    // Log the request data for debugging
    log.info('Attempting to find or create professor', { first_name, last_name });

    // If it's a duplicate request, ignore the conflict and proceed to create the professor
    if (is_duplicate) {
      const newProfessor = await Professor.create({
        first_name,
        last_name,
      });

      log.info('New professor added (duplicate)', { first_name, last_name });
      return NextResponse.json(
        { message: 'New professor added successfully', professor: newProfessor },
        { status: 201 }
      );
    }

    // Use Sequelize's findOrCreate to either find or create the professor
    const [professor, created] = await Professor.findOrCreate({
      where: { first_name, last_name },
      defaults: { first_name, last_name }, // These are the values to create a new professor if not found
    });

    if (created) {
      // If the professor was created, return a success response
      log.info('Professor added successfully', { first_name, last_name });
      return NextResponse.json(
        { message: 'Professor added successfully', professor },
        { status: 201 }
      );
    } else {
      // If the professor already exists, return a conflict response
      log.info('Professor already exists', { first_name, last_name });
      return NextResponse.json(
        { error: 'Professor already exists' },
        { status: 409 } // Conflict status code
      );
    }
  } catch (error) {
    log.error('Error adding professor', { error });
    return NextResponse.json({ error: 'Failed to add professor' }, { status: 500 });
  }
};
