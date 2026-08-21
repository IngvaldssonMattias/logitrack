import argon2 from "argon2";
import { RefreshToken } from "../models/refreshToken.model";
import { User } from "../../users/models/users.models";
import { AppError } from "../../../core/errors/AppError";
import { signAccessToken } from "../../../core/utils/jwt";
import { createRefreshToken } from "./auth.refreshToken.services";
import { access } from "fs";

export const refreshAccessToken = async (refreshToken: string) => {
    const storedTokens = await RefreshToken.find({
        revokedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
    });

    let matchedToken = null;

    for (const storedToken of storedTokens) {
        const isValid = await argon2.verify(
            storedToken.tokenHash,
            refreshToken,
        );

        if(isValid) {
            matchedToken = storedToken;
            break;
        }
    }

    if(!matchedToken) {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await User.findById(matchedToken.userId);

    if(!user) {
        throw new AppError("User not found", 401);
    }

    // Revoke old refresh token
    matchedToken.revokedAt = new Date();
    await matchedToken.save();

    // Create new tokens
    const accessToken = signAccessToken({
        userId: user._id.toString(),
        role: user.role,
    });

    const newRefreshToken = await createRefreshToken(user._id);

    return {
        user,
        accessToken,
        refreshToken: newRefreshToken,
    };
};