import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/gallery - Fetch all gallery items
export async function GET() {
  try {
    const galleryItems = await prisma.galleryItem.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: galleryItems,
    });
  } catch (error: any) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery items",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/gallery - Create a new gallery item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { src, title, description, order } = body;

    // Validate required fields
    if (!src) {
      return NextResponse.json(
        {
          success: false,
          message: "Image URL (src) is required",
        },
        { status: 400 }
      );
    }

    // Create gallery item
    const galleryItem = await prisma.galleryItem.create({
      data: {
        src,
        title: title || null,
        description: description || null,
        order: order ?? 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: galleryItem,
        message: "Gallery item created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create gallery item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
