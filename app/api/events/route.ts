import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();
    console.log("Creating event with body:", JSON.stringify(body, null, 2));

    const {
      title,
      slug,
      description,
      date,
      endDate,
      time,
      location,
      address,
      image,
      category,
      isPublished,
      isFeatured,
    } = body;

    // Validation
    if (!title || !slug || !date || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, slug, date, and category are required.",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      return NextResponse.json(
        { success: false, message: "An event with this slug already exists." },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        date: new Date(date),
        endDate: endDate ? new Date(endDate) : null,
        time,
        location,
        address,
        image,
        category,
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        createdById: user?.id || null,
        updatedById: user?.id || null,
      },
    });

    console.log("Event created successfully:", event.id);

    return NextResponse.json({
      success: true,
      data: event,
      message: "Event created successfully.",
    });
  } catch (error: any) {
    const logMessage = `[${new Date().toISOString()}] Error creating event: ${
      error.stack || error.message
    }\n`;
    fs.appendFileSync(path.join(process.cwd(), "api-debug.log"), logMessage);
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create event." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch events." },
      { status: 500 }
    );
  }
}
