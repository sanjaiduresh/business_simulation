import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/get-db';
import { cookies } from 'next/headers';
import { saveNewSimulation } from '@/lib/simulation-persistence';
import { SimulationStatus } from '@/components/simulation/types';
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

    const body = await req.json() as { name: string; description: string };
    const { name, description } = body;
    
    if (!name || !description) {
      return NextResponse.json({ error: 'Simulation name and description are required' }, { status: 400 });
    }

    // Create simulation with all required fields
    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const currentTimestamp = new Date().toISOString();
    
    const newSimulationState = {
      id: simulationId,
      name: name,
      description: description,
      config: 'default',
      currentPeriod: 0,
      status: SimulationStatus.ACTIVE,
      createdBy: userId,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp
    };

    const db = await getDB();
    await saveNewSimulation(newSimulationState, db);

    return NextResponse.json({
      message: 'Simulation created successfully!',
      id: simulationId
    }, { status: 201 });
 
  } catch (err) {
    console.error("Simulation creation failed:", err);
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create simulation' }, { status: 500 });
  }
}