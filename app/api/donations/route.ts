import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Received donation data:", data);

    // Validate required fields - only amount is required
    if (!data.amount) {
      console.log("Validation failed: missing amount");
      return NextResponse.json(
        { success: false, message: "Amount is required" },
        { status: 400 }
      );
    }

    // Create new donation record
    const donation = await prisma.donation.create({
      data: {
        // Core donation fields
        amount: data.amount,
        currency: data.currency || "USD",
        category: data.category || null,
        paymentMethod: data.paymentMethod || null,
        notes: data.notes || null,
        message: data.message || null,
        status: data.status || "PENDING",
        // Donor information fields
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        country: data.country || null,
        region: data.region || null,
        isAnonymous: data.isAnonymous || false,
        acceptedTerms: data.acceptedTerms || false,
        wantsUpdates: data.wantsUpdates ?? true,
      },
    });

    console.log("Donation saved successfully:", donation.id);
    return NextResponse.json({ success: true, donation });
  } catch (error: any) {
    console.error("Error saving donation:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// GET all donations (for admin dashboard)
export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.donation.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    });

    return NextResponse.json({
      success: true,
      donations,
      totalAmount: total._sum.amount || 0,
    });
  } catch (error: any) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
