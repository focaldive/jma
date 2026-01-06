import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch event." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request);
    const { id } = params;
    const body = await request.json();

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

    // Check if slug already exists for another event
    const existingEvent = await prisma.event.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existingEvent) {
      return NextResponse.json(
        { success: false, message: "An event with this slug already exists." },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
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
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        updatedById: user?.id || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: event,
      message: "Event updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update event." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete event." },
      { status: 500 }
    );
  }
}
