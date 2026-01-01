import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all donors (aggregated from donations)
export async function GET() {
  try {
    // Get all donations grouped by email/name to create donor list
    const donations = await prisma.donation.findMany({
      where: {
        isAnonymous: false,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        country: true,
        region: true,
        amount: true,
        currency: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Group donations by email to get unique donors with total amounts
    const donorMap = new Map<
      string,
      {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        country: string | null;
        region: string | null;
        totalAmount: number;
        currency: string;
        donationCount: number;
        lastDonation: Date;
      }
    >();

    for (const donation of donations) {
      const key =
        donation.email || `${donation.firstName}-${donation.lastName}`;
      const name =
        [donation.firstName, donation.lastName].filter(Boolean).join(" ") ||
        "Unknown";

      if (donorMap.has(key)) {
        const existing = donorMap.get(key)!;
        existing.totalAmount += Number(donation.amount);
        existing.donationCount += 1;
        if (new Date(donation.createdAt) > existing.lastDonation) {
          existing.lastDonation = new Date(donation.createdAt);
        }
      } else {
        donorMap.set(key, {
          id: donation.id,
          name,
          email: donation.email,
          phone: donation.phone,
          address: donation.address,
          country: donation.country,
          region: donation.region,
          totalAmount: Number(donation.amount),
          currency: donation.currency,
          donationCount: 1,
          lastDonation: new Date(donation.createdAt),
        });
      }
    }

    const donors = Array.from(donorMap.values());

    // Calculate total
    const totalAmount = donors.reduce((sum, d) => sum + d.totalAmount, 0);

    return NextResponse.json({
      success: true,
      donors,
      totalDonors: donors.length,
      totalAmount,
    });
  } catch (error: any) {
    console.error("Error fetching donors:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
