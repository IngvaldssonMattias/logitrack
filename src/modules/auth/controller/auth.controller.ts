import { Request, Response, NextFunction } from "express";
import { register } from "../services/auth.register.services";
import { login } from "../services/auth.login.services";
import { RegisterInput, LoginInput } from "../schemas/auth.schemas";
import { refreshAccessToken } from "../services/auth.refresh.services";
import { revokeRefreshToken } from "../services/auth.refreshToken.services";

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
    const { user, accessToken, refreshToken } = await login(req.body);

    const { passwordHash: _passwordHash, ...safeUser } = user.toObject();

    res.status(200).json({
      status: "success",
      data: {
        user: safeUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshAccessToken(refreshToken);

    const { passwordHash: _passwordHash, ...safeUser } = 
    result.user.toObject();

    res.status(200).json({
      status: "success",
      data: {
        user: safeUser,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch(error) {
    next(error);
  }
};

export const logoutHandler = async(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    await revokeRefreshToken(refreshToken);

    res.status(200).json({
      status: "success",
      message: "Logged out successfully"
    });
  } catch(error) {
    next(error);
  }
};