import argon2 from "argon2";
import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "../../../db";
import { refreshTokens, users } from "../../../db/schema";
import { AppError } from "../../../core/errors/AppError";
import { signAccessToken } from "../../../core/utils/jwt";
import { createRefreshToken } from "./auth.refreshToken.services";

export const refreshAccessToken = async (refreshToken: string) => {
  const storedTokens = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date()),
      ),
    );

  let matchedToken = null;

  for (const storedToken of storedTokens) {
    const isValid = await argon2.verify(
      storedToken.tokenHash,
      refreshToken,
    );

    if (isValid) {
      matchedToken = storedToken;
      break;
    }
  }

  if (!matchedToken) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, matchedToken.userId))
    .limit(1);

  if (!user) {
    throw new AppError("User not found", 401);
  }

  // Revoke old refresh token
  await db
    .update(refreshTokens)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refreshTokens.id, matchedToken.id));

  // Create new tokens
  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const newRefreshToken = await createRefreshToken(user.id);

  return {
    user,
    accessToken,
    refreshToken: newRefreshToken,
  };
};