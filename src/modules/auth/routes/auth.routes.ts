import Router from "express";
import { registerHandler, loginHandler, refreshHandler, logoutHandler } from "../controller/auth.controller";
import { validateRequest } from "../../../core/middleware/validateRequest";
import { registerSchema, loginSchema } from "../schemas/auth.schemas";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", validateRequest(registerSchema), registerHandler);
router.post("/login", validateRequest(loginSchema), loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);

// Protected routes
router.get("/me", authenticate, (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            user: req.user,
        },
    });
});


export default router;