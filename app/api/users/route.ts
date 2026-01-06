import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { log } from "console";

import { logActivity } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Check if user already exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.adminUser.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        role: data.role || "EDITOR",
        isActive: data.isActive !== undefined ? data.isActive : true,
        avatar: data.image,
      },
    });

    // LOGGING
    await logActivity({
      action: "Create",
      resource: "Users",
      description: `Created user ${user.name}`,
      details: { email: user.email, role: user.role },
      userId: user.id, // Ideally, this should be the ID of the ADMIN performing the action, but simpler for now
      isSecurityEvent: false,
    });

    // Don't send password back
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET all users
export async function GET() {
  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
