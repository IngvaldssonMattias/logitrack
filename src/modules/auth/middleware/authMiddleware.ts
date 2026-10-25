import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    role: "USER" | "ADMIN";
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                status: "fail",
                message: "Authentication required",
            });

            return;
        }

        const token = authHeader.split(" ")[1];

        if(!token) {
            res.status(401).json({
                status: "fail",
                message: "Authentication required",
            });

            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next();
    } catch {
        res.status(401).json({
            status: "fail",
            message: "Invalid or expired token",
        });
    }
};

export const requireRole = (...roles: Array<"USER" |"ADMIN">) => {
    return(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void => {
        if(!req.user) {
            res.status(401).json({
                status: "fail",
                message: "Authentication required",
            });

            return;
        }

        if(!roles.includes(req.user.role)) {
            res.status(403).json({
                status: "fail",
                message: "Forbidden",
            });

            return;
        }

        next();
    };
};