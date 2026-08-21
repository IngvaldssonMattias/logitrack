import jwt from "jsonwebtoken";

export interface JwtPayload {
    userId: string;
    role: "USER" | "ADMIN";
}

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;

    if(!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return secret;
};

export const signAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: "1h",
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    const decoded = jwt.verify(token, getJwtSecret());

    if(
        typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.userId !== "string" ||
        (decoded.role !== "USER" && decoded.role !== "ADMIN")
    ) {
        throw new Error ("Invalid token payload");
    }

    return {
        userId: decoded.userId,
        role: decoded.role,
    };
};