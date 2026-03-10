import { NextRequest, NextResponse } from "next/server";
import { getAllSkills, filterSkills, getCategories } from "@/lib/skills";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  if (query || category) {
    const results = filterSkills({ query, category });
    return NextResponse.json({ skills: results, total: results.length });
  }

  const skills = getAllSkills();
  const categories = getCategories();
  return NextResponse.json({ skills, categories, total: skills.length });
}
