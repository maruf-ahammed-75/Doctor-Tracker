import ApiError from "../utils/ApiError.js";

/**
 * 404 Not Found Middleware
 * Forwards a 404 ApiError to the centralized error handler
 */
export const notFound = (req, res, next) => {
  next(
    new ApiError(404, `Resource not found: Cannot ${req.method} ${req.originalUrl}`)
  );
};

export default notFound;
