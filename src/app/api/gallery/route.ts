import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const whereClause: any = {};
    if (category && category !== "All") {
      whereClause.category = category;
    }
    if (featured === "true") {
      whereClause.featured = true;
    }

    const images = await prisma.galleryImage.findMany({
      where: whereClause,
      include: {
        trip: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, images });
  } catch (error: any) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, title, category = "General", tripId, featured = false, sortOrder = 0 } = body;

    if (!imageUrl || !title) {
      return NextResponse.json({ error: "Image URL and title are required" }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: {
        imageUrl,
        title,
        category,
        tripId: tripId || null,
        featured: Boolean(featured),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, image });
  } catch (error: any) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 });
    }

    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/gallery error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
