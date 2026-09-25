import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";
import ApiError from "../utils/ApiError.js";
import { getPaginationOptions, formatPaginatedResponse } from "../utils/pagination.js";

/**
 * Builds dynamic MongoDB filter object from query parameters
 * Supports:
 * - search: text search via $text index on name and condition
 * - condition: exact match on condition field
 * - doctorId: exact match on doctor reference
 * - from/to: date range filter on visitDate ($gte, $lte)
 * @param {Object} query
 * @returns {Object} MongoDB filter object
 */
export const buildPatientFilter = (query = {}) => {
  const filter = {};

  // 1. Text search on name and condition
  if (query.search && query.search.trim()) {
    filter.$text = { $search: query.search.trim() };
  }

  // 2. Condition filter (exact match)
  if (query.condition && query.condition.trim()) {
    filter.condition = query.condition.trim();
  }

  // 3. Doctor ID filter (from query.doctorId or query.doctor)
  const doctorId = query.doctorId || query.doctor;
  if (doctorId && mongoose.isValidObjectId(doctorId)) {
    filter.doctor = new mongoose.Types.ObjectId(doctorId);
  }

  // 4. Date range filter on visitDate
  if (query.from || query.to) {
    filter.visitDate = {};

    if (query.from) {
      const fromDate = new Date(query.from);
      if (!isNaN(fromDate.getTime())) {
        filter.visitDate.$gte = fromDate;
      }
    }

    if (query.to) {
      const toDate = new Date(query.to);
      if (!isNaN(toDate.getTime())) {
        // If date-only format (YYYY-MM-DD), include full day through 23:59:59.999
        if (query.to.trim().length === 10) {
          toDate.setHours(23, 59, 59, 999);
        }
        filter.visitDate.$lte = toDate;
      }
    }

    if (Object.keys(filter.visitDate).length === 0) {
      delete filter.visitDate;
    }
  }

  return filter;
};

/**
 * Get paginated list of patients using DB-level filtering and pagination
 * @param {Object} query
 * @returns {Promise<{ data: Array, pagination: Object }>}
 */
export const getPatients = async (query = {}) => {
  const filter = buildPatientFilter(query);
  const { skip, limit, page } = getPaginationOptions(query);

  const sortCriteria = filter.$text
    ? { score: { $meta: "textScore" }, visitDate: -1 }
    : { visitDate: -1 };

  const queryBuilder = Patient.find(filter);

  if (filter.$text) {
    queryBuilder.select({ score: { $meta: "textScore" } });
  }

  const [data, total] = await Promise.all([
    queryBuilder
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .populate("doctor", "name specialization hospital phone email")
      .lean(),
    Patient.countDocuments(filter),
  ]);

  return formatPaginatedResponse(data, total, page, limit);
};

/**
 * Get paginated patients specifically under one doctor
 * @param {string} doctorId
 * @param {Object} query
 * @returns {Promise<{ data: Array, pagination: Object }>}
 */
export const getPatientsByDoctor = async (doctorId, query = {}) => {
  return getPatients({ ...query, doctorId });
};

/**
 * Find single patient by ID with populated doctor
 * @param {string} id
 */
export const getPatientById = async (id) => {
  return Patient.findById(id).populate("doctor", "name specialization hospital phone email");
};

/**
 * Create a new patient under a doctor
 * Verifies that the doctor exists first (404 if not)
 * @param {string} doctorId
 * @param {Object} data
 */
export const createPatientUnderDoctor = async (doctorId, data) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const patient = await Patient.create({
    ...data,
    doctor: doctorId,
  });

  return patient.populate("doctor", "name specialization hospital");
};

/**
 * Update an existing patient by ID
 * @param {string} id
 * @param {Object} updateData
 */
export const updatePatient = async (id, updateData) => {
  return Patient.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("doctor", "name specialization hospital phone email");
};

/**
 * Delete a patient by ID
 * @param {string} id
 */
export const deletePatient = async (id) => {
  return Patient.findByIdAndDelete(id);
};

export default {
  buildPatientFilter,
  getPatients,
  getPatientsByDoctor,
  getPatientById,
  createPatientUnderDoctor,
  updatePatient,
  deletePatient,
};
