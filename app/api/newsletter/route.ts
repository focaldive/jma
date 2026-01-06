import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/newsletter - Fetch all subscribers
export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: subscribers,
    });
  } catch (error: any) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subscribers",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide a list of IDs to delete." },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `${ids.length} subscriber(s) deleted successfully`,
    });
  } catch (error: any) {
    console.error("Error deleting subscribers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete subscribers",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, source, firstName, lastName } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      // If already subscribed but checking in again, we can just say success
      // Or if they were unsubscribed, we could resubscribe them (logic depends on requirements)
      // For now, let's just return success to avoid leaking privacy or confusing user
      return NextResponse.json(
        { success: true, message: "Thank you for subscribing!" },
        { status: 200 }
      );
    }

    // Get IP address
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        source: source || "website",
        ipAddress,
        isVerified: false, // Could implement double opt-in later
        verifyToken: crypto.randomUUID(), // Generate verification token
      },
    });

    return NextResponse.json(
      { success: true, message: "Thank you for subscribing!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
