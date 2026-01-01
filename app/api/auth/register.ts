import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // check existing user
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin created",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
