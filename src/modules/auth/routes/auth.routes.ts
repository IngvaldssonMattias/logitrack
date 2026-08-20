import Router from "express";
import { registerHandler } from "../controller/auth.controller";
import { validateRequest } from "../../../core/middleware/validateRequest";
import { registerSchema } from "../schemas/auth.schemas";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerHandler);

export default router;