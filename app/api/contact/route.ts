import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    const errors: string[] = [];

    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (!message) errors.push("Message is required");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }
    console.log("Form data:", { name, email, phone, message });

    console.log("Testing", name, email, phone, message);

    const saved = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message saved successfully!",
        data: saved,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("API error:", e);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
