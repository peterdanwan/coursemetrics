import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/database/connectDB';
import Policy from '@/database/models/Policy';
import { logger } from '@/utils';

export const GET = async function getPolicies(req: NextRequest): Promise<NextResponse> {
  const log = logger.child({ module: 'app/api/policies/route.ts' });

  try {
    await connectDB();

    // Fetch all policies from the database
    const policies = await Policy.findAll();

    if (!policies) {
      log.warn('No policies found');
      return NextResponse.json({ message: 'No policies found' }, { status: 404 });
    }

    return NextResponse.json({ data: policies }, { status: 200 });
  } catch (error) {
    console.error(error);
    log.error('Error fetching policies', { error });
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
};
