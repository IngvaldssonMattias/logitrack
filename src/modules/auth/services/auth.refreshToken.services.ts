import crypto from "crypto";
import argon2 from "argon2";
import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "../../../db";
import { refreshTokens } from "../../../db/schema";
import { AppError } from "../../../core/errors/AppError";

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

export const createRefreshToken = async (
  userId: string,
): Promise<string> => {
  const refreshToken = crypto.randomBytes(64).toString("hex");

  const tokenHash = await argon2.hash(refreshToken);

  const expiresAt = new Date(
    Date.now() +
      REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );

  await db.insert(refreshTokens).values({
    userId,
    tokenHash,
    expiresAt,
  });

  return refreshToken;
};

export const revokeRefreshToken = async (
  refreshToken: string,
): Promise<void> => {
  const storedTokens = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date()),
      ),
    );

  for (const storedToken of storedTokens) {
    const isValid = await argon2.verify(
      storedToken.tokenHash,
      refreshToken,
    );

    if (isValid) {
      await db
        .update(refreshTokens)
        .set({
          revokedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(refreshTokens.id, storedToken.id));

      return;
    }
  }

  throw new AppError("Invalid or expired refresh token", 401);
};