import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Your prisma client
import bcrypt from "bcrypt";
import { logActivity } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email in AdminUser table
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is disabled. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Compare password with passwordHash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" }, // Generic message for security
        { status: 401 }
      );
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        // lastLoginIp: req.ip // Optional: if you want to track IP
      },
    });

    // LOGGING
    await logActivity({
      action: "Login",
      resource: "Auth",
      description: "User logged in",
      userId: user.id,
      ipAddress: req.headers.get("x-forwarded-for") || "unknown",
      isSecurityEvent: true,
    });

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
