import argon2 from "argon2";
import { eq } from "drizzle-orm";

import { db } from "../../../db";
import { users } from "../../../db/schema";
import { RegisterInput } from "../schemas/auth.schemas";
import { AppError } from "../../../core/errors/AppError";

export const register = async (data: RegisterInput) => {
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, data.email),
    });

    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await argon2.hash(data.password, {
        type: argon2.argon2id,
    });

    const [user] = await db
        .insert(users)
        .values({
            name: data.name,
            email: data.email,
            passwordHash,
            role: "USER",
        })
        .returning();

    return user;
};