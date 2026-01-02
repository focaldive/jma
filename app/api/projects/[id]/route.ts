import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch a single project
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update a project
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await req.json();

    // In a real app, get user from session
    const admin = await prisma.adminUser.findFirst();

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        image: data.image !== undefined ? data.image : undefined,
        year: data.year ? parseInt(data.year) : undefined,
        month: data.month,
        description: data.description,
        location: data.location,
        currency: data.currency,
        amount: data.amount,
        status: data.status,
        beneficiaries:
          data.beneficiaries !== undefined
            ? data.beneficiaries
              ? parseInt(data.beneficiaries)
              : null
            : undefined,
        isPublished:
          data.isPublished !== undefined ? data.isPublished : undefined,
        updatedById: admin?.id,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove a project
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
