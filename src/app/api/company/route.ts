import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No session found' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = decoded.id;
 
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const simulationId = searchParams.get('simulationId');

    if (!simulationId) {
      return NextResponse.json({ error: 'Simulation ID is required' }, { status: 400 });
    }

    const db = await getDB();
    
    // Verify the simulation exists and belongs to the user
    const simulation = await db.getSimulation(simulationId);
    if (!simulation || simulation.created_by !== userId) {
      return NextResponse.json({ 
        error: 'Simulation not found or access denied' 
      }, { status: 404 });
    }

    const companies = await db.getCompaniesBySimulation(simulationId);

    // Transform database results to match frontend expectations
    const transformedCompanies = companies.map((company: any) => ({
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
      updatedAt: company.updated_at
    }));

    return NextResponse.json({
      companies: transformedCompanies
    }, { status: 200 });
 
  } catch (err) {
    console.error("Failed to fetch companies:", err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}