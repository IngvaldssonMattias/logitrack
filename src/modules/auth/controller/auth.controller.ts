import { Request, Response, NextFunction } from "express";
import { register } from "../services/auth.register.services";
import { login } from "../services/auth.login.services";
import { RegisterInput, LoginInput } from "../schemas/auth.schemas";

export const registerHandler = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await register(req.body);

    const { passwordHash: _passwordHash, ...safeUser } = user.toObject();

    res.status(201).json({
      status: "success",
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await login(req.body);

    const { passwordHash: _passwordHash, ...safeUser } = user.toObject();

    res.status(200).json({
      status: "success",
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    next(error);
  }
};