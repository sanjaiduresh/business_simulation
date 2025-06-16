import { getDB } from "@/lib/get-db";
import jwt  from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token:any = req.cookies.get('token')
  if(!token){
    return NextResponse.json({
      message:"No user logged in"
    })
  }
  const decoded:any = jwt.verify(token.value, process.env.JWT_SECRET!)
  const db = await getDB();
  console.log('Database connection established:', db);
  const user = await db.getUserByEmail(decoded.email)
  return NextResponse.json({user})
}