import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

/**
 * Reusable middleware factory to validate ObjectId format in route parameters.
 * Returns a clean 400 Bad Request error if an ID parameter is not a valid MongoDB ObjectId.
 * 
 * Usage:
 *   router.get("/:id", validateObjectId("id"), handler);
 *   router.delete("/:id/patients/:patientId", validateObjectId("id", "patientId"), handler);
 *
 * @param {...string} paramNames - Parameter names in req.params to validate (default: 'id')
 */
export const validateObjectId = (...paramNames) => {
  const paramsToCheck = paramNames.length > 0 ? paramNames : ["id"];

  return (req, res, next) => {
    for (const param of paramsToCheck) {
      const value = req.params[param];
      if (value && !mongoose.isValidObjectId(value)) {
        return next(
          new ApiError(
            400,
            `Invalid ${param} format: "${value}" is not a valid MongoDB ObjectId`
          )
        );
      }
    }
    next();
  };
};

export default validateObjectId;
