import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { MessageStatus } from "@/app/generated/prisma";

// GET /api/contact - Fetch all contact submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    // Validate if the status is a valid MessageStatus
    const status =
      statusParam &&
      Object.values(MessageStatus).includes(statusParam as MessageStatus)
        ? (statusParam as MessageStatus)
        : undefined;

    const where = status ? { status } : {};

    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        repliedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error: any) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch contact submissions",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message, subject } = await request.json();

    const errors: string[] = [];

    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (!message) errors.push("Message is required");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Get IP address from headers
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown";

    console.log("Form data:", { name, email, phone, message, subject });

    const saved = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        subject: subject || null,
        ipAddress,
        userAgent,
        status: "NEW", // Default status
        priority: "NORMAL", // Default priority
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
        data: saved,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("API error:", e);

    return NextResponse.json(
      { success: false, message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
