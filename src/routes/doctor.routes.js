import { Router } from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
import {
  getPatientsForDoctor,
  addPatientToDoctor,
  removePatientFromDoctor,
} from "../controllers/patient.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
import {
  createDoctorSchema,
  updateDoctorSchema,
} from "../validators/doctor.validator.js";
import { createPatientSchema } from "../validators/patient.validator.js";

const router = Router();

// Apply protect middleware across all doctor endpoints
router.use(protect);

// Doctor CRUD routes
router
  .route("/")
  .post(validate(createDoctorSchema), createDoctor)
  .get(getDoctors);

router
  .route("/:id")
  .get(validateObjectId("id"), getDoctorById)
  .put(validateObjectId("id"), validate(updateDoctorSchema), updateDoctor)
  .delete(validateObjectId("id"), deleteDoctor);

// Nested Doctor-Patient routes
router
  .route("/:id/patients")
  .get(validateObjectId("id"), getPatientsForDoctor)
  .post(validateObjectId("id"), validate(createPatientSchema), addPatientToDoctor);

router
  .route("/:id/patients/:patientId")
  .delete(validateObjectId("id", "patientId"), removePatientFromDoctor);

export default router;
