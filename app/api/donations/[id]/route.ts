import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const donation = await prisma.donation.findUnique({
      where: { id },
    });

    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, donation });
  } catch (error: any) {
    console.error("Error fetching donation:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// UPDATE donation status or other fields
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const donation = await prisma.donation.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
      },
    });

    return NextResponse.json({ success: true, donation });
  } catch (error: any) {
    console.error("Error updating donation:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE donation
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.donation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Donation deleted" });
  } catch (error: any) {
    console.error("Error deleting donation:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
