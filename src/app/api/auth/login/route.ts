import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/get-db";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {
  try {
    const { email, password }: any = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const user = await db.getUserByEmail(email);

    const encrypt = {
      role: user.role,
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign({ ...encrypt }, process.env.JWT_SECRET!, {
      expiresIn: "10h",
    });

    const cookieStore = await cookies();

    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    console.log("Matched user:", user);
    console.log("JWT Secret:", process.env.JWT_SECRET);

    return NextResponse.json({
      user,
    });
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
