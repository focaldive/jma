import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/contact/[id] - Fetch a single contact submission
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
      include: {
        repliedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: submission,
    });
  } catch (error: any) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch message",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/contact/[id] - Update a contact submission
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      message: "Message updated successfully",
      data: submission,
    });
  } catch (error: any) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update message",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/contact/[id] - Delete a contact submission
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.contactSubmission.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
