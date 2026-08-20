import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodError } from "zod";

export const validateRequest = <T extends z.ZodType>(
  schema: T,
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (
        typeof validatedData === "object" &&
        validatedData !== null
      ) {
        if ("body" in validatedData) {
          req.body = validatedData.body;
        }

        if ("query" in validatedData) {
          req.query = validatedData.query as typeof req.query;
        }

        if ("params" in validatedData) {
          req.params = validatedData.params as typeof req.params;
        }
      }

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "fail",
          errors: error.issues.map((err) => ({
            field: err.path
              .join(".")
              .replace(/^(body|query|params)\./, ""),
            message: err.message,
          })),
        });

        return;
      }

      next(error);
    }
  };
};