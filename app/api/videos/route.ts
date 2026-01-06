import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/videos - Fetch all videos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: { isActive: true },
      orderBy: [
        { isFeatured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      data: videos,
    });
  } catch (error: any) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch videos",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/videos - Create a new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      thumbnail,
      sourceType,
      youtubeUrl,
      videoFile,
      artist,
      duration,
      category,
      order,
      isFeatured,
    } = body;

    // Validate required fields
    if (!title || !sourceType) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and source type are required",
        },
        { status: 400 }
      );
    }

    // Validate based on source type
    if (sourceType === "YOUTUBE" && !youtubeUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "YouTube URL is required for YouTube videos",
        },
        { status: 400 }
      );
    }

    if (sourceType === "LOCAL" && !videoFile) {
      return NextResponse.json(
        {
          success: false,
          message: "Video file is required for local videos",
        },
        { status: 400 }
      );
    }

    // Extract YouTube ID and generate thumbnail if YouTube
    let finalThumbnail = thumbnail;
    let extractedYoutubeId = null;
    if (sourceType === "YOUTUBE" && youtubeUrl) {
      extractedYoutubeId = extractYoutubeId(youtubeUrl);
      if (extractedYoutubeId && !finalThumbnail) {
        finalThumbnail = `https://img.youtube.com/vi/${extractedYoutubeId}/maxresdefault.jpg`;
      }
    }

    // Create video
    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        thumbnail: finalThumbnail || null,
        sourceType,
        youtubeUrl: sourceType === "YOUTUBE" ? youtubeUrl : null,
        youtubeId: extractedYoutubeId,
        videoFile: sourceType === "LOCAL" ? videoFile : null,
        artist: artist || null,
        duration: duration || null,
        category: category || null,
        order: order ?? 0,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: video,
        message: "Video created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create video",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to extract YouTube ID
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
