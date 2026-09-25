import { ApiError } from "../utils/ApiError.js";

/**
 * Middleware factory to validate request body using a Zod schema
 * Returns 422 with field-level errors on validation failure
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const formattedErrors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return next(new ApiError(422, "Validation error", formattedErrors));
      }

      // Replace req.body with sanitized and typed data from Zod
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
