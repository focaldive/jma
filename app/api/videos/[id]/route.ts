import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// GET /api/videos/[id] - Fetch a single video
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          message: "Video not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: video,
    });
  } catch (error: any) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch video",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/videos/[id] - Update video
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      thumbnail,
      artist,
      duration,
      category,
      order,
      isActive,
      isFeatured,
    } = body;

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id },
    });

    if (!existingVideo) {
      return NextResponse.json(
        {
          success: false,
          message: "Video not found",
        },
        { status: 404 }
      );
    }

    // Update video
    const updatedVideo = await prisma.video.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(thumbnail !== undefined && { thumbnail: thumbnail || null }),
        ...(artist !== undefined && { artist: artist || null }),
        ...(duration !== undefined && { duration: duration || null }),
        ...(category !== undefined && { category: category || null }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedVideo,
      message: "Video updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update video",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/videos/[id] - Delete a video
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id },
    });

    if (!existingVideo) {
      return NextResponse.json(
        {
          success: false,
          message: "Video not found",
        },
        { status: 404 }
      );
    }

    // Delete local video file if it exists
    if (existingVideo.sourceType === "LOCAL" && existingVideo.videoFile) {
      const filepath = path.join(
        process.cwd(),
        "public",
        existingVideo.videoFile
      );
      if (existsSync(filepath)) {
        try {
          await unlink(filepath);
        } catch (err) {
          console.error("Error deleting video file:", err);
        }
      }
    }

    // Delete video from database
    await prisma.video.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete video",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
