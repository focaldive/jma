import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const resource = searchParams.get("resource");
    const action = searchParams.get("action");
    const status = searchParams.get("status"); // You used 'status' in frontend types but my schema doesn't have it directly. I'll infer or skip.
    // Actually, status was just visual in frontend. 'FailedLogin' action conveys failure.
    const securityOnly = searchParams.get("securityOnly") === "true";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where: any = {};

    if (userId && userId !== "all") where.userId = userId;
    if (resource && resource !== "all") where.resource = resource;
    if (action && action !== "all") where.action = action;
    if (securityOnly) where.isSecurityEvent = true;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo + "T23:59:59");
    }

    const logs = await prisma.systemLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        adminUser: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      take: 100, // Limit for now
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
