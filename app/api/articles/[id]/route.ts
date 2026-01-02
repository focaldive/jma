import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch a single article by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const article = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update an article
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    // Generate new slug if title changed
    const slug = data.title
      ? data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : undefined;

    const article = await prisma.newsArticle.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        content: data.content,
        category: data.category,
        excerpt: data.excerpt || null,
        featuredImage: data.featuredImage || null,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete an article
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.newsArticle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Article deleted" });
  } catch (error: any) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
