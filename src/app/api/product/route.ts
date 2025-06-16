import { NextResponse } from 'next/server';
import { createDatabaseService } from '@/lib/database';
import { getDB } from '@/lib/get-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const db = await getDB();
    const databaseService = createDatabaseService(db);
    const products = await databaseService.getProductsByCompany(companyId);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}