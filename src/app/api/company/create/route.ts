// company/create/route.ts - Create company endpoint
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { simulationId, name, description } = body as {
      simulationId: string;
      name: string;
      description: string;
    };

    if (!simulationId || !name || !description) {
      return NextResponse.json({ 
        error: 'Simulation ID, company name, and description are required' 
      }, { status: 400 });
    }

    const db = await getDB();
    
    // Verify the simulation exists and belongs to the user
    const simulation = await db.getSimulation(simulationId);
    if (!simulation || simulation.created_by !== userId) {
      return NextResponse.json({ 
        error: 'Simulation not found or access denied' 
      }, { status: 404 });
    }

    // Create company with default financial values
    const companyId = `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const currentTimestamp = new Date().toISOString();
    
    const newCompany = {
      id: companyId,
      simulationId: simulationId,
      userId: userId,
      name: name,
      description: description,
      logoUrl: null,
      cashBalance: 1000000, // Starting cash: $1M
      totalAssets: 1000000,
      totalLiabilities: 0,
      creditRating: 'A',
      brandValue: 100000, // Starting brand value: $100K
      data: JSON.stringify({}), // Additional data as JSON
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp
    };

    const createdCompanyId = await db.createCompany(newCompany);

    return NextResponse.json({
      message: 'Company created successfully!',
      id: createdCompanyId,
      company: {
        id: createdCompanyId,
        simulationId,
        userId,
        name,
        description,
        cashBalance: newCompany.cashBalance,
        totalAssets: newCompany.totalAssets,
        totalLiabilities: newCompany.totalLiabilities,
        creditRating: newCompany.creditRating,
        brandValue: newCompany.brandValue,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
      }
    }, { status: 201 });
 
  } catch (err) {
    console.error("Company creation failed:", err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}