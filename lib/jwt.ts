import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// Token payload structure
export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

// Get secrets from environment variables
const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in environment variables"
    );
  }
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables"
    );
  }
  return secret;
};

// Token expiration times
export const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

/**
 * Generate an access token (short-lived)
 * Used for authenticating API requests
 */
export function generateAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
  return jwt.sign(payload, getAccessSecret(), options);
}

/**
 * Generate a refresh token (long-lived)
 * Used to obtain new access tokens without re-login
 */
export function generateRefreshToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  };
  return jwt.sign(payload, getRefreshSecret(), options);
}

/**
 * Verify and decode an access token
 * Returns the payload if valid, throws error if invalid/expired
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, getAccessSecret()) as JwtPayload &
      TokenPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Access token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid access token");
    }
    throw error;
  }
}

/**
 * Verify and decode a refresh token
 * Returns the payload if valid, throws error if invalid/expired
 */
export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, getRefreshSecret()) as JwtPayload &
      TokenPayload;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Refresh token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid refresh token");
    }
    throw error;
  }
}

/**
 * Get token expiration time in seconds
 * Useful for client-side token refresh scheduling
 */
export function getAccessTokenExpirySeconds(): number {
  return 15 * 60; // 15 minutes in seconds
}

export function getRefreshTokenExpirySeconds(): number {
  return 7 * 24 * 60 * 60; // 7 days in seconds
}
