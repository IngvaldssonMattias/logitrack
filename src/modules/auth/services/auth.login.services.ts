import argon2 from "argon2";
import { eq } from "drizzle-orm";

import { db } from "../../../db";
import { users } from "../../../db/schema";
import { LoginInput } from "../schemas/auth.schemas";
import { AppError } from "../../../core/errors/AppError";
import { signAccessToken } from "../../../core/utils/jwt";
import { createRefreshToken } from "./auth.refreshToken.services";

export const login = async (data: LoginInput) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await argon2.verify(
    user.passwordHash,
    data.password,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = await createRefreshToken(user.id);

  return {
    user,
    accessToken,
    refreshToken,
  };
};