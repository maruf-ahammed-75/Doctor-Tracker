import { Router } from "express";
import { login, logout, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

// Public routes
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);

// Protected routes
router.get("/me", protect, getMe);

export default router;
