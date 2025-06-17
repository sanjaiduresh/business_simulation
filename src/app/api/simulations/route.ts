import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';


export async function GET(req: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized ' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }
    const db = await getDB();
    const resultFromDb = await db.getSimulationsByUser(userId);
    let rawSimulations: any[] = [];
    if (Array.isArray(resultFromDb)) {
      rawSimulations = resultFromDb;
    } else if (resultFromDb) {
      rawSimulations = [resultFromDb];
    }
    const simulations = rawSimulations.map(sim => ({
      id: sim.id,
      name: sim.name,
      description: sim.description,
      currentPeriod: sim.current_period,
      status: sim.status,
      createdBy: sim.created_by,
      createdAt: sim.created_at,
      updatedAt: sim.updated_at
    }));
    return NextResponse.json({ simulations });

  } catch (err) {
    console.error("Failed to fetch simulations:", err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized ' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch simulations' }, { status: 500 });
  }
}
 