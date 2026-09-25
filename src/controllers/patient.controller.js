import mongoose from "mongoose";
import patientService from "../services/patient.service.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    List all patients with search, filters, and pagination (dedicated /api/patients route)
 * @route   GET /api/patients
 * @access  Private (Admin)
 */
export const getPatients = asyncHandler(async (req, res) => {
  const result = await patientService.getPatients(req.query);

  return res.status(200).json({
    success: true,
    message: "Patients retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

/**
 * @desc    Get single patient details by ID
 * @route   GET /api/patients/:id
 * @access  Private (Admin)
 */
export const getPatientById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid patient ID format");
  }

  const patient = await patientService.getPatientById(id);

  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient retrieved successfully"));
});

/**
 * @desc    Update patient details by ID
 * @route   PUT /api/patients/:id
 * @access  Private (Admin)
 */
export const updatePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid patient ID format");
  }

  const updatedPatient = await patientService.updatePatient(id, req.body);

  if (!updatedPatient) {
    throw new ApiError(404, "Patient not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, "Patient updated successfully"));
});

/**
 * @desc    Delete a patient by ID
 * @route   DELETE /api/patients/:id
 * @access  Private (Admin)
 */
export const deletePatient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid patient ID format");
  }

  const deletedPatient = await patientService.deletePatient(id);

  if (!deletedPatient) {
    throw new ApiError(404, "Patient not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Patient deleted successfully"));
});

/**
 * @desc    Get paginated patients under a specific doctor
 * @route   GET /api/doctors/:id/patients
 * @access  Private (Admin)
 */
export const getPatientsForDoctor = asyncHandler(async (req, res) => {
  const { id: doctorId } = req.params;

  if (!mongoose.isValidObjectId(doctorId)) {
    throw new ApiError(400, "Invalid doctor ID format");
  }

  // Verify doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const result = await patientService.getPatientsByDoctor(doctorId, req.query);

  return res.status(200).json({
    success: true,
    message: `Patients for Dr. ${doctor.name} retrieved successfully`,
    data: result.data,
    pagination: result.pagination,
  });
});

/**
 * @desc    Add a patient under a specific doctor
 * @route   POST /api/doctors/:id/patients
 * @access  Private (Admin)
 */
export const addPatientToDoctor = asyncHandler(async (req, res) => {
  const { id: doctorId } = req.params;

  if (!mongoose.isValidObjectId(doctorId)) {
    throw new ApiError(400, "Invalid doctor ID format");
  }

  const patient = await patientService.createPatientUnderDoctor(doctorId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, patient, "Patient added under doctor successfully"));
});

/**
 * @desc    Remove a patient from a specific doctor
 * @route   DELETE /api/doctors/:id/patients/:patientId
 * @access  Private (Admin)
 */
export const removePatientFromDoctor = asyncHandler(async (req, res) => {
  const { id: doctorId, patientId } = req.params;

  if (!mongoose.isValidObjectId(doctorId)) {
    throw new ApiError(400, "Invalid doctor ID format");
  }

  if (!mongoose.isValidObjectId(patientId)) {
    throw new ApiError(400, "Invalid patient ID format");
  }

  // Verify doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  // Verify patient exists
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  // Verify patient actually belongs to this doctor
  if (patient.doctor.toString() !== doctorId.toString()) {
    throw new ApiError(404, "Patient does not belong to this doctor");
  }

  await patientService.deletePatient(patientId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Patient removed from doctor successfully"));
});

export default {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientsForDoctor,
  addPatientToDoctor,
  removePatientFromDoctor,
};
