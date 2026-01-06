import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notice = await prisma.janazaNotice.findUnique({
      where: { id },
    });

    if (!notice) {
      return NextResponse.json(
        { success: false, message: "Notice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, notice });
  } catch (error: any) {
    console.error("Error fetching Janaza notice:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    // Basic validation
    if (!data.deceasedName) {
      return NextResponse.json(
        { success: false, message: "Deceased name is required" },
        { status: 400 }
      );
    }

    const notice = await prisma.janazaNotice.update({
      where: { id },
      data: {
        deceasedName: data.deceasedName,
        age: data.age ? parseInt(data.age) : null,
        prayerDate: data.prayerDate ? new Date(data.prayerDate) : (null as any),
        prayerTime: data.prayerTime,
        prayerLocation: data.prayerLocation,
        burialLocation: data.burialLocation,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        notes: data.notes,
        status: data.status,
        isPublished: data.isPublished,
      },
    });

    await logActivity({
      action: "Update",
      resource: "News",
      description: `Updated Janaza Notice for ${notice.deceasedName}`,
      userId: "system",
      details: { id: notice.id, name: notice.deceasedName },
    });

    return NextResponse.json({ success: true, notice });
  } catch (error: any) {
    console.error("Error updating Janaza notice:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const notice = await prisma.janazaNotice.delete({
      where: { id },
    });

    await logActivity({
      action: "Delete",
      resource: "News",
      description: `Deleted Janaza Notice for ${notice.deceasedName}`,
      userId: "system",
      details: { id: notice.id, name: notice.deceasedName },
    });

    return NextResponse.json({ success: true, message: "Notice deleted" });
  } catch (error: any) {
    console.error("Error deleting Janaza notice:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
