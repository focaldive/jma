import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const keys = Object.keys(prisma).filter(
      (k) => !k.startsWith("_") && !k.startsWith("$")
    );
    const systemLogExists = !!prisma.systemLog;

    return NextResponse.json({
      success: true,
      message: "Prisma Debug Info",
      models: keys,
      hasSystemLog: systemLogExists,
      prismaVersion: (prisma as any)._clientVersion,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
