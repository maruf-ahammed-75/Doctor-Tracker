import ApiError from "../utils/ApiError.js";

/**
 * Centralized error handler middleware
 * Translates Mongoose, MongoDB, JWT, and generic errors into consistent ApiError shapes:
 * { success: false, message: string, errors: array }
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Mongoose Validation Error -> 422 Unprocessable Entity
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));
    error = new ApiError(422, "Validation failed", errors, err.stack);
  }

  // 2. Mongoose Cast Error (invalid ObjectId) -> 400 Bad Request
  else if (err.name === "CastError") {
    const message = `Invalid ${err.path}: "${err.value}" is not a valid format`;
    error = new ApiError(400, message, [], err.stack);
  }

  // 3. MongoDB Duplicate Key Error (code 11000) -> 409 Conflict
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue ? err.keyValue[field] : "";
    const message = `A record with ${field} "${value}" already exists`;
    const errors = [{ field, message: `${field} must be unique` }];
    error = new ApiError(409, message, errors, err.stack);
  }

  // 4. JWT Errors -> 401 Unauthorized
  else if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please log in again.", [], err.stack);
  } else if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token has expired. Please log in again.", [], err.stack);
  }

  // 5. If not already an ApiError, wrap as 500 or existing status
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const isProduction = process.env.NODE_ENV === "production";
    const message =
      statusCode >= 500 && isProduction
        ? "Internal Server Error"
        : error.message || "Internal Server Error";

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Log unexpected server errors
  if (error.statusCode >= 500) {
    console.error(`💥 [UNHANDLED ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
