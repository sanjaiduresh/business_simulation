import { NextResponse } from 'next/server';
import { createDatabaseService } from '@/lib/database';
import { getDB } from '@/lib/get-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDB();
    const databaseService = createDatabaseService(db);
    const companyId = await databaseService.createCompany(body);
    return NextResponse.json({ id: companyId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}