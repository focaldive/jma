import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch all projects
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status) where.status = status;

    const projects = await prisma.project.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new project
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // In a real app, we'd get the user ID from the session/JWT
    const admin = await prisma.adminUser.findFirst();

    const project = await prisma.project.create({
      data: {
        title: data.title || null,
        image: data.image || null,
        year: parseInt(data.year),
        month: data.month,
        description: data.description,
        location: data.location,
        currency: data.currency || "USD",
        amount: data.amount,
        status: data.status || "COMPLETED",
        beneficiaries: data.beneficiaries ? parseInt(data.beneficiaries) : null,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
        createdById: admin?.id,
        updatedById: admin?.id,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
