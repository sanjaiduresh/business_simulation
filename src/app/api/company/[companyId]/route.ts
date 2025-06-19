import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  try {
    // Verify authentication
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No session found' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    // Extract companyId from params
    const { companyId } = params;
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Get database instance
    const db = await getDB();

    // Fetch the company
    const company = await db.getCompany(companyId);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Verify user has access to the company (e.g., company belongs to a simulation the user created or is associated with)
    const simulation = await db.getSimulation(company.simulation_id);
    if (!simulation || simulation.created_by !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Transform company data to match frontend expectations
    const transformedCompany = {
      id: company.id,
      simulationId: company.simulation_id,
      userId: company.user_id,
      name: company.name,
      description: company.description,
      logoUrl: company.logo_url,
      cashBalance: company.cash_balance,
      totalAssets: company.total_assets,
      totalLiabilities: company.total_liabilities,
      creditRating: company.credit_rating,
      brandValue: company.brand_value,
      data: company.data ? JSON.parse(company.data) : {},
      createdAt: company.created_at,
      updatedAt: company.updated_at,
    };

    return NextResponse.json(transformedCompany, { status: 200 });
  } catch (err) {
    console.error('Failed to fetch company:', err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}