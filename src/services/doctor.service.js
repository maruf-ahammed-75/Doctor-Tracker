import Doctor from "../models/Doctor.js";
import { getPaginationOptions, formatPaginatedResponse } from "../utils/pagination.js";

/**
 * Builds dynamic MongoDB filter object from query parameters
 * Supports:
 * - search: text search via $text index on name, specialization, hospital
 * - specialization: exact match
 * - from/to: date range filter on createdAt ($gte, $lte)
 * @param {Object} query
 * @returns {Object} MongoDB filter object
 */
export const buildDoctorFilter = (query = {}) => {
  const filter = {};

  // 1. Text search using text index
  if (query.search && query.search.trim()) {
    filter.$text = { $search: query.search.trim() };
  }

  // 2. Specialization filter (exact match)
  if (query.specialization && query.specialization.trim()) {
    filter.specialization = query.specialization.trim();
  }

  // 3. Date range filter on createdAt
  if (query.from || query.to) {
    filter.createdAt = {};

    if (query.from) {
      const fromDate = new Date(query.from);
      if (!isNaN(fromDate.getTime())) {
        filter.createdAt.$gte = fromDate;
      }
    }

    if (query.to) {
      const toDate = new Date(query.to);
      if (!isNaN(toDate.getTime())) {
        // If date-only format (YYYY-MM-DD), include full day through 23:59:59.999
        if (query.to.trim().length === 10) {
          toDate.setHours(23, 59, 59, 999);
        }
        filter.createdAt.$lte = toDate;
      }
    }

    // Clean up empty createdAt object if invalid dates were provided
    if (Object.keys(filter.createdAt).length === 0) {
      delete filter.createdAt;
    }
  }

  return filter;
};

/**
 * Get paginated list of doctors using DB-level filtering and pagination
 * @param {Object} query
 * @returns {Promise<{ data: Array, pagination: Object }>}
 */
export const getDoctors = async (query = {}) => {
  const filter = buildDoctorFilter(query);
  const { skip, limit, page } = getPaginationOptions(query);

  // If text search is performed, sort by text score relevance; otherwise sort by createdAt descending
  const sortCriteria = filter.$text
    ? { score: { $meta: "textScore" }, createdAt: -1 }
    : { createdAt: -1 };

  const queryBuilder = Doctor.find(filter);

  if (filter.$text) {
    queryBuilder.select({ score: { $meta: "textScore" } });
  }

  const [data, total] = await Promise.all([
    queryBuilder
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email")
      .lean(),
    Doctor.countDocuments(filter),
  ]);

  return formatPaginatedResponse(data, total, page, limit);
};

/**
 * Find single doctor by ID
 * @param {string} id
 */
export const getDoctorById = async (id) => {
  return Doctor.findById(id).populate("createdBy", "name email");
};

/**
 * Create a new doctor document
 * @param {Object} doctorData
 */
export const createDoctor = async (doctorData) => {
  return Doctor.create(doctorData);
};

/**
 * Update an existing doctor by ID
 * @param {string} id
 * @param {Object} updateData
 */
export const updateDoctor = async (id, updateData) => {
  return Doctor.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name email");
};

/**
 * Delete a doctor by ID
 * @param {string} id
 */
export const deleteDoctor = async (id) => {
  return Doctor.findByIdAndDelete(id);
};

export default {
  buildDoctorFilter,
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
