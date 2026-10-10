import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateBookingId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const tripId = searchParams.get("tripId");

    const whereClause: any = {};

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (tripId) {
      whereClause.tripId = tripId;
    }

    if (search) {
      whereClause.OR = [
        { bookingId: { contains: search } },
        { customerName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { tripTitle: { contains: search } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        trip: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            duration: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      tripId,
      tripTitle,
      customerName,
      email,
      phone,
      travelers = 1,
      date,
      specialRequests = "",
    } = body;

    if (!customerName || !email || !phone || !date) {
      return NextResponse.json(
        { error: "Customer name, email, phone, and preferred date are required" },
        { status: 400 }
      );
    }

    let calculatedPrice = 0;
    let resolvedTitle = tripTitle || "Custom Traverse Package";

    if (tripId) {
      const trip = await prisma.trip.findUnique({ where: { id: tripId } });
      if (trip) {
        resolvedTitle = trip.title;
        calculatedPrice = trip.price * (Number(travelers) || 1);
      }
    }

    const bookingId = generateBookingId();

    const booking = await prisma.booking.create({
      data: {
        bookingId,
        tripId: tripId || null,
        tripTitle: resolvedTitle,
        customerName,
        email,
        phone,
        travelers: Number(travelers) || 1,
        date,
        specialRequests,
        totalPrice: calculatedPrice,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.bookingId,
      booking,
    });
  } catch (error: any) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit booking" },
      { status: 500 }
    );
  }
}
