import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodObject, ZodError } from "zod";

export const validateRequest = <T extends ZodObject<any>>(
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

      req.validated = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "fail",
          errors: error.issues.map((err) => ({
            field: err.path.join(".").replace(/^(body|query|params)\./, ""),
            message: err.message,
          })),
        });

        return;
      }

      next(error);
    }
  };
};
