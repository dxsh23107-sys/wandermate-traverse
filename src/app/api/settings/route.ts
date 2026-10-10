import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
      logoUrl,
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
        ...(logoUrl !== undefined && { logoUrl }),
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
        logoUrl: logoUrl || null,
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
