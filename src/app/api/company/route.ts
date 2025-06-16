// import { NextResponse } from 'next/server';
// import { createDatabaseService } from '@/lib/database';
// import { getDB } from '@/lib/get-db';

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');
//     const db = await getDB();
//     const databaseService = createDatabaseService(db);
//     const companies = await databaseService.getCompaniesByUser(userId);
//     return NextResponse.json(companies, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }