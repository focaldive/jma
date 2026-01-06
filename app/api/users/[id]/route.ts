import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET: Fetch single user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update user
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Check if user exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name: body.name,
      email: body.email,
      avatar: body.image, // Map image -> avatar
      isActive: body.isActive,
      updatedAt: new Date(),
    };

    // Handle Role mapping
    const roleMap: Record<string, any> = {
      ADMIN: "ADMIN",
      EDITOR: "EDITOR",
      VIEWER: "VIEWER",
    };
    if (body.role) {
      updateData.role = roleMap[body.role] || "EDITOR";
    }

    // Handle Password update if provided
    if (body.newPassword) {
      updateData.passwordHash = await bcrypt.hash(body.newPassword, 10);
    }

    // Check email uniqueness if email changed
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await prisma.adminUser.findUnique({
        where: { email: body.email },
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: updateData,
    });

    const { passwordHash, ...userResponse } = updatedUser;

    return NextResponse.json({ success: true, user: userResponse });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
