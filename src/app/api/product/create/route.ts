import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
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

    // Parse request body
    const body = await req.json();
    const {
      companyId,
      name,
      description,
      category,
      qualityRating,
      innovationRating,
      sustainabilityRating,
      productionCost,
      sellingPrice,
      developmentCost,
      status,
    } = body as {
      companyId: string;
      name: string;
      description?: string;
      category: string;
      qualityRating?: number;
      innovationRating?: number;
      sustainabilityRating?: number;
      productionCost?: number;
      sellingPrice?: number;
      developmentCost?: number;
      status: string;
    };

    // Validate required fields
    if (!companyId || !name || !category || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, name, category, and status are required' },
        { status: 400 }
      );
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

    // Prepare product data
    const now = new Date().toISOString();
    const productData = {
      companyId,
      name,
      description: description || '',
      category,
      qualityRating: qualityRating || 0,
      innovationRating: innovationRating || 0,
      sustainabilityRating: sustainabilityRating || 0,
      productionCost: productionCost || 0,
      sellingPrice: sellingPrice || 0,
      developmentCost: developmentCost || 0,
      status,
      createdAt: now,
      updatedAt: now,
    };

    // Create product in the database
    const productId = await db.createProduct(productData);

    // Fetch the newly created product to return
    const createdProduct = await db.getProduct(productId);
    if (!createdProduct) {
      return NextResponse.json({ error: 'Failed to retrieve created product' }, { status: 500 });
    }

    // Transform product data to match frontend expectations
    const transformedProduct = {
      id: createdProduct.id,
      companyId: createdProduct.company_id,
      name: createdProduct.name,
      description: createdProduct.description,
      category: createdProduct.category,
      qualityRating: createdProduct.quality_rating,
      innovationRating: createdProduct.innovation_rating,
      sustainabilityRating: createdProduct.sustainability_rating,
      productionCost: createdProduct.production_cost,
      sellingPrice: createdProduct.selling_price,
      inventoryLevel: createdProduct.inventory_level,
      productionCapacity: createdProduct.production_capacity,
      developmentCost: createdProduct.development_cost,
      marketingBudget: createdProduct.marketing_budget,
      status: createdProduct.status,
      createdAt: createdProduct.created_at,
      updatedAt: createdProduct.updated_at,
    };

    return NextResponse.json(transformedProduct, { status: 201 });
  } catch (err) {
    console.error('Failed to create product:', err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}