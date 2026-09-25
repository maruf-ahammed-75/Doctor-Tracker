import mongoose from "mongoose";
import doctorService from "../services/doctor.service.js";
import Doctor from "../models/Doctor.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Create a new doctor
 * @route   POST /api/doctors
 * @access  Private (Admin)
 */
export const createDoctor = asyncHandler(async (req, res) => {
  // Check if doctor email is already registered
  const existingDoctor = await Doctor.findOne({
    email: req.body.email.toLowerCase().trim(),
  });

  if (existingDoctor) {
    throw new ApiError(409, "A doctor with this email address already exists");
  }

  // Attach creator (admin) ID
  const doctorData = {
    ...req.body,
    email: req.body.email.toLowerCase().trim(),
    createdBy: req.user._id || req.user.id,
  };

  const doctor = await doctorService.createDoctor(doctorData);

  return res
    .status(201)
    .json(new ApiResponse(201, doctor, "Doctor created successfully"));
});

/**
 * @desc    List all doctors with search, filters, and pagination
 * @route   GET /api/doctors
 * @access  Private (Admin)
 */
export const getDoctors = asyncHandler(async (req, res) => {
  const result = await doctorService.getDoctors(req.query);

  return res.status(200).json({
    success: true,
    message: "Doctors retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

/**
 * @desc    Get single doctor details by ID
 * @route   GET /api/doctors/:id
 * @access  Private (Admin)
 */
export const getDoctorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid doctor ID format");
  }

  const doctor = await doctorService.getDoctorById(id);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Doctor retrieved successfully"));
});

/**
 * @desc    Update doctor details by ID
 * @route   PUT /api/doctors/:id
 * @access  Private (Admin)
 */
export const updateDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid doctor ID format");
  }

  // If email is being modified, ensure no collision with another doctor
  if (req.body.email) {
    const emailLower = req.body.email.toLowerCase().trim();
    const existing = await Doctor.findOne({
      email: emailLower,
      _id: { $ne: id },
    });

    if (existing) {
      throw new ApiError(409, "Another doctor is already registered with this email address");
    }

    req.body.email = emailLower;
  }

  const updatedDoctor = await doctorService.updateDoctor(id, req.body);

  if (!updatedDoctor) {
    throw new ApiError(404, "Doctor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedDoctor, "Doctor updated successfully"));
});

/**
 * @desc    Delete a doctor by ID
 * @route   DELETE /api/doctors/:id
 * @access  Private (Admin)
 */
export const deleteDoctor = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid doctor ID format");
  }

  /*
   * ARCHITECTURAL DECISION POINT:
   * Should deleting a doctor cascade-delete all their assigned patients?
   * In healthcare tracking systems, deleting a doctor typically requires either reassigning
   * their patients to an active practitioner or soft-deleting/archiving the patient history for audit integrity.
   * For Section 8, Step 3, we execute single-document deletion of the doctor only.
   * Cascade cleanup or reassignment can be handled when Patient associations are built in Step 4.
   */
  const deletedDoctor = await doctorService.deleteDoctor(id);

  if (!deletedDoctor) {
    throw new ApiError(404, "Doctor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Doctor deleted successfully"));
});

export default {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
