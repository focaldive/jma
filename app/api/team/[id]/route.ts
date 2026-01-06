import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/team/[id] - Fetch single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      return NextResponse.json(
        {
          success: false,
          message: "Team member not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
    });
  } catch (error: any) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/team/[id] - Update team member
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: teamMember,
      message: "Team member updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update team member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Delete team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete team member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
