import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a specific donor's details with all their donations
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First get the donation to find the donor's email
    const donation = await prisma.donation.findUnique({
      where: { id },
    });

    if (!donation) {
      return NextResponse.json(
        { success: false, message: "Donor not found" },
        { status: 404 }
      );
    }

    // Get all donations from this donor by email or name
    const donorKey =
      donation.email || `${donation.firstName}-${donation.lastName}`;

    let allDonations;
    if (donation.email) {
      allDonations = await prisma.donation.findMany({
        where: { email: donation.email },
        orderBy: { createdAt: "desc" },
      });
    } else {
      allDonations = await prisma.donation.findMany({
        where: {
          firstName: donation.firstName,
          lastName: donation.lastName,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    // Build donor object
    const donor = {
      id: donation.id,
      name:
        [donation.firstName, donation.lastName].filter(Boolean).join(" ") ||
        "Unknown",
      email: donation.email,
      phone: donation.phone,
      address: donation.address,
      country: donation.country,
      region: donation.region,
      totalAmount: allDonations.reduce((sum, d) => sum + Number(d.amount), 0),
      donationCount: allDonations.length,
      donations: allDonations.map((d) => ({
        id: d.id,
        date: d.createdAt.toISOString(),
        amount: Number(d.amount),
        currency: d.currency,
        category: d.category || "General",
        status: d.status,
      })),
    };

    return NextResponse.json({ success: true, donor });
  } catch (error: any) {
    console.error("Error fetching donor:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
