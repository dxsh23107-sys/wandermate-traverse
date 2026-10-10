import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const trip = await prisma.trip.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        itinerary: {
          orderBy: { day: "asc" },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, trip });
  } catch (error: any) {
    console.error("GET /api/trips/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const {
      title,
      destination,
      category,
      duration,
      price,
      originalPrice,
      startingLocation,
      endingLocation,
      availableSeats,
      dates,
      shortDescription,
      fullDescription,
      coverImage,
      gallery,
      highlights,
      inclusions,
      exclusions,
      faqs,
      importantInfo,
      status,
      featured,
      itinerary,
    } = body;

    const existingTrip = await prisma.trip.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Delete existing itinerary items and recreate if itinerary array is provided
    if (Array.isArray(itinerary)) {
      await prisma.itineraryItem.deleteMany({
        where: { tripId: existingTrip.id },
      });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: existingTrip.id },
      data: {
        ...(title && { title }),
        ...(title && title !== existingTrip.title && { slug: slugify(title) }),
        ...(destination && { destination }),
        ...(category && { category }),
        ...(duration && { duration }),
        ...(price !== undefined && { price: Number(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? Number(originalPrice) : null }),
        ...(startingLocation !== undefined && { startingLocation }),
        ...(endingLocation !== undefined && { endingLocation }),
        ...(availableSeats !== undefined && { availableSeats: Number(availableSeats) }),
        ...(dates !== undefined && { dates: typeof dates === "string" ? dates : JSON.stringify(dates) }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(fullDescription !== undefined && { fullDescription }),
        ...(coverImage !== undefined && { coverImage }),
        ...(gallery !== undefined && { gallery: typeof gallery === "string" ? gallery : JSON.stringify(gallery) }),
        ...(highlights !== undefined && { highlights: typeof highlights === "string" ? highlights : JSON.stringify(highlights) }),
        ...(inclusions !== undefined && { inclusions: typeof inclusions === "string" ? inclusions : JSON.stringify(inclusions) }),
        ...(exclusions !== undefined && { exclusions: typeof exclusions === "string" ? exclusions : JSON.stringify(exclusions) }),
        ...(faqs !== undefined && { faqs: typeof faqs === "string" ? faqs : JSON.stringify(faqs) }),
        ...(importantInfo !== undefined && { importantInfo: typeof importantInfo === "string" ? importantInfo : JSON.stringify(importantInfo) }),
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(Array.isArray(itinerary) && {
          itinerary: {
            create: itinerary.map((item: any, idx: number) => ({
              day: item.day || idx + 1,
              title: item.title || `Day ${idx + 1}`,
              description: item.description || "",
              meals: item.meals || "",
              stay: item.stay || "",
            })),
          },
        }),
      },
      include: {
        itinerary: {
          orderBy: { day: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, trip: updatedTrip });
  } catch (error: any) {
    console.error("PUT /api/trips/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update trip" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const existingTrip = await prisma.trip.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    await prisma.trip.delete({
      where: { id: existingTrip.id },
    });

    return NextResponse.json({ success: true, message: "Trip deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/trips/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 });
  }
}
