import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function GET() {
  try {
    const notices = await prisma.janazaNotice.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, notices });
  } catch (error: any) {
    console.error("Error fetching Janaza notices:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Basic validation only for published notices or checking minimal requirements
    if (!data.deceasedName) {
      return NextResponse.json(
        { success: false, message: "Deceased name is required" },
        { status: 400 }
      );
    }

    // If publishing, ensure other fields are present (optional enforcement on backend, primarily frontend)
    if (data.isPublished) {
      if (!data.prayerDate || !data.prayerLocation) {
        return NextResponse.json(
          {
            success: false,
            message: "Prayer date and location are required for publishing",
          },
          { status: 400 }
        );
      }
    }

    // Create Janaza Notice
    const notice = await prisma.janazaNotice.create({
      data: {
        deceasedName: data.deceasedName,
        age: data.age ? parseInt(data.age) : null,
        prayerDate: data.prayerDate ? new Date(data.prayerDate) : null,
        prayerTime: data.prayerTime,
        prayerLocation: data.prayerLocation,
        burialLocation: data.burialLocation,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        notes: data.notes,
        status: data.status || "UPCOMING",
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      },
    });

    // Log Activity
    await logActivity({
      action: "Create",
      resource: "News", // Using "News" or maybe add "Janaza" to resource types later
      description: `Created Janaza Notice for ${notice.deceasedName}`,
      userId: "system", // Or extract from session if available
      details: { id: notice.id, name: notice.deceasedName },
    });

    return NextResponse.json({ success: true, notice });
  } catch (error: any) {
    console.error("Error creating Janaza notice:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
