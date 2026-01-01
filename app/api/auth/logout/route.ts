import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { verifyRefreshToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    // ================================
    // 1. Validate Input
    // ================================
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token is required" },
        { status: 400 }
      );
    }

    // ================================
    // 2. Verify the Refresh Token
    // ================================
    let tokenPayload;
    try {
      tokenPayload = verifyRefreshToken(refreshToken);
    } catch {
      // Even if token is invalid/expired, return success
      // (user wanted to logout anyway)
      return NextResponse.json({
        success: true,
        message: "Logged out successfully",
      });
    }

    // ================================
    // 3. Find User and Clear Token
    // ================================
    const user = await prisma.adminUser.findUnique({
      where: { id: tokenPayload.id },
    });

    if (user) {
      // Hash the provided token to compare
      const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      // Only clear if the token matches (prevent others from logging you out)
      if (user.refreshToken === refreshTokenHash) {
        await prisma.adminUser.update({
          where: { id: user.id },
          data: { refreshToken: null },
        });
      }
    }

    // ================================
    // 4. Return Success
    // ================================
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    // Even on error, return success for logout
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
