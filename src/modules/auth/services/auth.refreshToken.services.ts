import crypto from "crypto";
import argon2 from "argon2";
import { RefreshToken } from "../models/refreshToken.model";
import mongoose from "mongoose";
import { AppError } from "../../../core/errors/AppError";
import { NextFunction } from "express";

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

export const createRefreshToken = async (
  userId: mongoose.Types.ObjectId,
): Promise<string> => {
  const refreshToken = crypto.randomBytes(64).toString("hex");

  const tokenHash = await argon2.hash(refreshToken);

  const expiresAt = new Date(
    Date.now() +
      REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );

  await RefreshToken.create({
    userId,
    tokenHash,
    expiresAt,
  });

  return refreshToken;
};

export const revokeRefreshToken = async (
  refreshToken: string,
): Promise<void> => {
  const storedTokens = await RefreshToken.find({
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  for (const storedToken of storedTokens) {
    const isValid = await argon2.verify(
      storedToken.tokenHash,
      refreshToken,
    );

    if (isValid) {
      storedToken.revokedAt = new Date();
      await storedToken.save();
      return;
    }
  }

  throw new AppError("Invalid or expired refresh token", 401);
};