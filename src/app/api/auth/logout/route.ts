import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}