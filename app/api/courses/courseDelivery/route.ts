// app/api/courses/courseDelivery/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { connectDB } from '@/database/connectDB';
import { createSuccessResponse, createErrorResponse } from '@/utils';
import { logger } from '@/utils';
import CourseDeliveryFormat from '@/database/models/CourseDeliveryFormat';

export const dynamic = 'force-dynamic';

// ===== API ROUTE TO FETCH COURSE DELIVERY FORMATS =====
export const GET = async function get_course_delivery_formats(
  req: NextRequest
): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/courseDelivery/route.ts' });

  try {
    // Connect to the database
    await connectDB();

    const url = new URL(req.url);
    const format = url.searchParams.get('format'); // Optional query param to filter by format name
    const id = url.searchParams.get('id'); // Optional query param to filter by ID

    let courseDeliveryFormats;

    if (format) {
      // If 'format' is provided, filter by format
      courseDeliveryFormats = await CourseDeliveryFormat.findAll({
        where: { format }, // Filter by format name
      });
    } else if (id) {
      // If 'id' is provided, filter by course_delivery_format_id
      courseDeliveryFormats = await CourseDeliveryFormat.findAll({
        where: { course_delivery_format_id: id },
      });
    } else {
      // Otherwise, fetch all course delivery formats
      courseDeliveryFormats = await CourseDeliveryFormat.findAll();
    }

    log.debug({ courseDeliveryFormats }, 'Course delivery formats fetched from DB');

    return NextResponse.json(createSuccessResponse({ courseDeliveryFormats }), { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    log.error('Error fetching course delivery formats', { error });
    return NextResponse.json(
      createErrorResponse(500, 'Something went wrong. A server-side issue occurred.'),
      { status: 500 }
    );
  }
};
