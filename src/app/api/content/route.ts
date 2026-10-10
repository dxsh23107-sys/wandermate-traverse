import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await prisma.websiteContent.findMany();
    const contentMap: Record<string, any> = {};

    records.forEach((rec) => {
      try {
        contentMap[rec.id] = JSON.parse(rec.content);
      } catch {
        contentMap[rec.id] = rec.content;
      }
    });

    return NextResponse.json({ success: true, content: contentMap });
  } catch (error: any) {
    console.error("GET /api/content error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { section, content } = body;

    if (!section || !content) {
      return NextResponse.json({ error: "Section and content are required" }, { status: 400 });
    }

    const jsonString = typeof content === "string" ? content : JSON.stringify(content);

    const record = await prisma.websiteContent.upsert({
      where: { id: section },
      update: { content: jsonString },
      create: { id: section, content: jsonString },
    });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error("PUT /api/content error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
