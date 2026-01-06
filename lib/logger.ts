import { PrismaClient } from "../app/generated/prisma/client";

// Use a singleton pattern for Prisma if not already in lib/prisma.ts,
// strictly speaking we should import the shared instance.
// Assuming @/lib/prisma exports a default prisma instance.
import prisma from "@/lib/prisma";

type ActionType =
  | "Login"
  | "Logout"
  | "Create"
  | "Update"
  | "Delete"
  | "FailedLogin"
  | "PasswordChange"
  | "RoleChange";
type ResourceType =
  | "Auth"
  | "Users"
  | "Events"
  | "News"
  | "Projects"
  | "Donations"
  | "Settings"
  | "Messages";

interface LogParams {
  action: ActionType;
  resource: ResourceType;
  description: string;
  details?: any; // Will be JSON stringified
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  isSecurityEvent?: boolean;
}

export async function logActivity(params: LogParams) {
  try {
    const {
      action,
      resource,
      description,
      details,
      ipAddress,
      userAgent,
      userId,
      isSecurityEvent,
    } = params;

    await prisma.systemLog.create({
      data: {
        action,
        resource,
        description,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent,
        userId,
        isSecurityEvent: isSecurityEvent || false,
      },
    });
  } catch (error) {
    console.error("CRITICAL: Failed to create system log", error);
    // Print the payload that failed
    console.error("Payload:", params);
  }
}
