import dashboardService from "../services/dashboard.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Get dashboard summary statistics (totalDoctors, totalPatients)
 * @route   GET /api/dashboard/summary
 * @access  Private (Admin)
 */
export const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary();

  return res
    .status(200)
    .json(new ApiResponse(200, summary, "Dashboard summary retrieved successfully"));
});

/**
 * @desc    Get patients per doctor using a single aggregation pipeline
 * @route   GET /api/dashboard/patients-per-doctor
 * @access  Private (Admin)
 */
export const getPatientsPerDoctor = asyncHandler(async (req, res) => {
  const result = await dashboardService.getPatientsPerDoctor();

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Patients per doctor retrieved successfully"));
});

/**
 * @desc    Get patient counts grouped by day or month
 * @route   GET /api/dashboard/stats-by-date
 * @access  Private (Admin)
 */
export const getStatsByDate = asyncHandler(async (req, res) => {
  const { groupBy = "day" } = req.query;

  if (groupBy && !["day", "month"].includes(groupBy.toLowerCase())) {
    throw new ApiError(
      400,
      "Invalid groupBy parameter. Allowed values are 'day' or 'month'"
    );
  }

  const result = await dashboardService.getStatsByDate(groupBy.toLowerCase());

  return res
    .status(200)
    .json(new ApiResponse(200, result, `Stats by ${groupBy} retrieved successfully`));
});

export default {
  getSummary,
  getPatientsPerDoctor,
  getStatsByDate,
};
