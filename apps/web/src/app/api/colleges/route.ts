import { NextResponse } from "next/server";
import { listColleges } from "@/server/services/colleges";

export async function GET() {
  try {
    const result = await listColleges();
    return NextResponse.json({ colleges: result });
  } catch {
    return NextResponse.json({ colleges: [] });
  }
}
