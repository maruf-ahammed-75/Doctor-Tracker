import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Middleware to protect private routes
 * Verifies JWT token from httpOnly cookie or Authorization Bearer header
 * Attaches user (excluding password) to req.user
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check httpOnly cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fallback to Authorization: Bearer <token> header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Reject if token is missing
  if (!token) {
    throw new ApiError(401, "Not authorized to access this route, token missing");
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB, excluding password
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User belonging to this token no longer exists");
    }

    // Attach user to req
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Not authorized, invalid or expired token");
  }
});

export default protect;
