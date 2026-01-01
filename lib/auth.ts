import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ============================================
// JWT Authentication Utilities
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, TokenPayload } from "./jwt";

/**
 * Extract and verify the Bearer token from request headers
 * Returns the decoded user payload if valid
 */
export function getAuthUser(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

/**
 * Require authentication for an API route
 * Returns error response if not authenticated, or user data if valid
 */
export function requireAuth(request: NextRequest): TokenPayload | NextResponse {
  const user = getAuthUser(request);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized - Invalid or missing token" },
      { status: 401 }
    );
  }

  return user;
}

/**
 * Check if the authenticated user has one of the required roles
 */
export function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): TokenPayload | NextResponse {
  const authResult = requireAuth(request);

  // If it's a NextResponse, it means auth failed
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!allowedRoles.includes(authResult.role)) {
    return NextResponse.json(
      { success: false, message: "Forbidden - Insufficient permissions" },
      { status: 403 }
    );
  }

  return authResult;
}

/**
 * Type guard to check if the result is a user payload (not an error response)
 */
export function isAuthenticated(
  result: TokenPayload | NextResponse
): result is TokenPayload {
  return !(result instanceof NextResponse);
}
