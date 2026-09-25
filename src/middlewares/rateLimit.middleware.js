import rateLimit from "express-rate-limit";
import ApiError from "../utils/ApiError.js";

/**
 * Rate limiter specifically for login route to prevent brute-force attacks
 * Limits to 5 attempts per 15-minute window per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  standardHeaders: true, // Return standard RateLimit headers
  legacyHeaders: false, // Disable X-RateLimit headers
  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many login attempts from this IP, please try again after 15 minutes"
      )
    );
  },
});

export default loginLimiter;
