import { NextRequest, NextResponse } from "next/server";
import { listCourses, getCourse } from "@/server/services/courses";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (code) {
    try {
      const course = await getCourse(code);
      if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
      return NextResponse.json(course);
    } catch {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
  }

  const collegeSlug = searchParams.get("college") ?? undefined;
  const departmentSlug = searchParams.get("department") ?? undefined;
  const query = searchParams.get("q") ?? undefined;

  try {
    const result = await listCourses({ collegeSlug, departmentSlug, query });
    return NextResponse.json({ courses: result });
  } catch {
    return NextResponse.json({ courses: [] });
  }
}
