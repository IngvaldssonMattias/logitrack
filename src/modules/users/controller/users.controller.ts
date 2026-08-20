import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/users.service";
import { CreateUserInput } from "../schemas/users.schema";

export const createUserHandler = async (
  req: Request<unknown, unknown, CreateUserInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await UserService.createUser(req.body);

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};