import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const all = searchParams.get("all") === "true";

    const session = await getSession();
    const isAdmin = session?.role === "ADMIN";

    const whereClause: any = {};

    // Only admins can see non-ACTIVE trips if requested
    if (!isAdmin || !all) {
      whereClause.status = "ACTIVE";
    }

    if (category && category !== "All") {
      whereClause.category = category;
    }

    if (featured === "true") {
      whereClause.featured = true;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { destination: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        itinerary: {
          orderBy: { day: "asc" },
        },
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ success: true, trips });
  } catch (error: any) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      destination,
      category = "Trek",
      duration,
      price,
      originalPrice,
      startingLocation,
      endingLocation,
      availableSeats = 12,
      dates = [],
      shortDescription,
      fullDescription,
      coverImage,
      gallery = [],
      highlights = [],
      inclusions = [],
      exclusions = [],
      faqs = [],
      importantInfo = "",
      status = "ACTIVE",
      featured = false,
      itinerary = [],
    } = body;

    if (!title || !destination || !duration || !price) {
      return NextResponse.json(
        { error: "Missing required fields (title, destination, duration, price)" },
        { status: 400 }
      );
    }

    let slug = slugify(title);
    // Ensure slug uniqueness
    const existing = await prisma.trip.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        slug,
        destination,
        category,
        duration,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        startingLocation: startingLocation || destination,
        endingLocation: endingLocation || destination,
        availableSeats: Number(availableSeats) || 12,
        dates: typeof dates === "string" ? dates : JSON.stringify(dates),
        shortDescription: shortDescription || "",
        fullDescription: fullDescription || "",
        coverImage: coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
        gallery: typeof gallery === "string" ? gallery : JSON.stringify(gallery),
        highlights: typeof highlights === "string" ? highlights : JSON.stringify(highlights),
        inclusions: typeof inclusions === "string" ? inclusions : JSON.stringify(inclusions),
        exclusions: typeof exclusions === "string" ? exclusions : JSON.stringify(exclusions),
        faqs: typeof faqs === "string" ? faqs : JSON.stringify(faqs),
        importantInfo: typeof importantInfo === "string" ? importantInfo : JSON.stringify(importantInfo),
        status,
        featured: Boolean(featured),
        itinerary: {
          create: Array.isArray(itinerary)
            ? itinerary.map((item: any, idx: number) => ({
                day: item.day || idx + 1,
                title: item.title || `Day ${idx + 1}`,
                description: item.description || "",
                meals: item.meals || "",
                stay: item.stay || "",
              }))
            : [],
        },
      },
      include: {
        itinerary: {
          orderBy: { day: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, trip });
  } catch (error: any) {
    console.error("POST /api/trips error:", error);
    return NextResponse.json({ error: error.message || "Failed to create trip" }, { status: 500 });
  }
}
