const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log('Created:', filePath);
}

// 1. /api/auth/login/route.ts
writeFile('src/app/api/auth/login/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Admin privileges required." },
        { status: 403 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
`);

// 2. /api/auth/logout/route.ts
writeFile('src/app/api/auth/logout/route.ts', `
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
`);

// 3. /api/auth/me/route.ts
writeFile('src/app/api/auth/me/route.ts', `
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}
`);

// 4. /api/trips/route.ts
writeFile('src/app/api/trips/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

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
      slug = \`\${slug}-\${Date.now()}\`;
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
                title: item.title || \`Day \${idx + 1}\`,
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
`);

// 5. /api/trips/[id]/route.ts
writeFile('src/app/api/trips/[id]/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

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
              title: item.title || \`Day \${idx + 1}\`,
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
`);

// 6. /api/bookings/route.ts
writeFile('src/app/api/bookings/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateBookingId } from "@/lib/utils";

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
`);

// 7. /api/bookings/[id]/route.ts
writeFile('src/app/api/bookings/[id]/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

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
    const { status, specialRequests, travelers, date } = body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(specialRequests !== undefined && { specialRequests }),
        ...(travelers !== undefined && { travelers: Number(travelers) }),
        ...(date && { date }),
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("PUT /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
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

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
`);

// 8. /api/gallery/route.ts
writeFile('src/app/api/gallery/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

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
`);

// 9. /api/content/route.ts
writeFile('src/app/api/content/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

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
`);

// 10. /api/settings/route.ts
writeFile('src/app/api/settings/route.ts', `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "default",
          brandName: "Wandermate Traverse",
          tagline: "Less Talk. More Traverse.",
          whatsappNumber: "8779884225",
          instagram: "@wandermate.traversee",
          email: "wandermate@wt.in",
          phone: "+91 8779884225",
          address: "Mumbai & Himalayan Basecamps, India",
          currencySymbol: "₹",
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      brandName,
      tagline,
      whatsappNumber,
      instagram,
      email,
      phone,
      address,
      currencySymbol,
    } = body;

    const settings = await prisma.settings.upsert({
      where: { id: "default" },
      update: {
        ...(brandName && { brandName }),
        ...(tagline && { tagline }),
        ...(whatsappNumber && { whatsappNumber }),
        ...(instagram && { instagram }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(currencySymbol && { currencySymbol }),
      },
      create: {
        id: "default",
        brandName: brandName || "Wandermate Traverse",
        tagline: tagline || "Less Talk. More Traverse.",
        whatsappNumber: whatsappNumber || "8779884225",
        instagram: instagram || "@wandermate.traversee",
        email: email || "wandermate@wt.in",
        phone: phone || "+91 8779884225",
        address: address || "India",
        currencySymbol: currencySymbol || "₹",
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
`);

// 11. /api/upload/route.ts
writeFile('src/app/api/upload/route.ts', `
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = \`\${timestamp}_\${safeName}\`;
    const blob = await put(\`uploads/\${fileName}\`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed: " + error.message }, { status: 500 });
  }
}
`);

console.log('All API route files written!');


