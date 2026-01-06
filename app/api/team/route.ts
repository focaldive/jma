import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/team - Fetch all team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const where = activeOnly ? { isActive: true } : {};

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: teamMembers,
    });
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch team members",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/team - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      role,
      department,
      bio,
      phone,
      email,
      image,
      linkedin,
      twitter,
      order,
      isActive,
      showOnSite,
    } = body;

    // Validate required fields
    if (!name || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and role are required",
        },
        { status: 400 }
      );
    }

    // Create team member
    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        department: department || null,
        bio: bio || null,
        phone: phone || null,
        email: email || null,
        image: image || null,
        linkedin: linkedin || null,
        twitter: twitter || null,
        order: order ?? 0,
        isActive: isActive ?? true,
        showOnSite: showOnSite ?? true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: teamMember,
        message: "Team member created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create team member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
