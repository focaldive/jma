import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST - Create a new article
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Creating article:", data);

    // Validate required fields
    if (!data.title || !data.content || !data.category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, content, and category are required",
        },
        { status: 400 }
      );
    }

    // Generate slug from title if not provided
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Create new article
    const article = await prisma.newsArticle.create({
      data: {
        title: data.title,
        slug: slug,
        content: data.content,
        category: data.category,
        excerpt: data.excerpt || null,
        featuredImage: data.featuredImage || null,
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
        publishedAt: data.isPublished ? new Date() : null,
      },
    });

    console.log("Article created:", article.id);
    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all articles
export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
    });
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
