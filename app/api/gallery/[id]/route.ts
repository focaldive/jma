import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/gallery/[id] - Fetch a single gallery item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const galleryItem = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!galleryItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: galleryItem,
    });
  } catch (error: any) {
    console.error("Error fetching gallery item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch gallery item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/gallery/[id] - Update gallery item metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, order } = body;

    // Check if gallery item exists
    const existingItem = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery item not found",
        },
        { status: 404 }
      );
    }

    // Update gallery item
    const updatedItem = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title || null }),
        ...(description !== undefined && { description: description || null }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: "Gallery item updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating gallery item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update gallery item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id] - Delete a gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if gallery item exists
    const existingItem = await prisma.galleryItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery item not found",
        },
        { status: 404 }
      );
    }

    // Delete gallery item
    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete gallery item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
