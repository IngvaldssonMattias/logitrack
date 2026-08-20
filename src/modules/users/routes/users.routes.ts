import { Router } from "express";

import { createUserHandler } from "../controller/users.controller";
import { createUserSchema } from "../schemas/users.schema";
import { validateRequest } from "../../../core/middleware/validateRequest";

const userRouter = Router();

userRouter.post("/", validateRequest(createUserSchema), createUserHandler);

export default userRouter;