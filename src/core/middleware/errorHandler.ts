import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });

    return;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({
      status: "fail",
      message: "Tracking number already exists",
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};