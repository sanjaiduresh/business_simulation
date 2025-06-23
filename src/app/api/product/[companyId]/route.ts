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

    // Verify company exists and user has access
    const company = await db.getCompany(companyId);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Verify user has access to the company via simulation
    const simulation = await db.getSimulation(company.simulation_id);
    if (!simulation || simulation.created_by !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch products for the company
    const products = await db.getProductsByCompany(companyId);
    if (!products) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Transform product data to match frontend expectations
    const transformedProducts = products.map((product: any) => ({
      id: product.id,
      companyId: product.company_id,
      name: product.name,
      description: product.description,
      category: product.category,
      qualityRating: product.quality_rating,
      innovationRating: product.innovation_rating,
      sustainabilityRating: product.sustainability_rating,
      productionCost: product.production_cost,
      sellingPrice: product.selling_price,
      inventoryLevel: product.inventory_level,
      productionCapacity: product.production_capacity,
      developmentCost: product.development_cost,
      marketingBudget: product.marketing_budget,
      status: product.status,
      launchPeriod: product.launch_period,
      discontinuePeriod: product.discontinue_period,
      data: product.data ? JSON.parse(product.data) : {},
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }));

    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}