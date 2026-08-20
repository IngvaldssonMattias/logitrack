export class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    status: "fail" | "error" = "fail",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}