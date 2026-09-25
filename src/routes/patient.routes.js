import { Router } from "express";
import {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
import { updatePatientSchema } from "../validators/patient.validator.js";

const router = Router();

// Apply protect middleware across all patient routes
router.use(protect);

router.route("/").get(getPatients);

router
  .route("/:id")
  .get(validateObjectId("id"), getPatientById)
  .put(validateObjectId("id"), validate(updatePatientSchema), updatePatient)
  .delete(validateObjectId("id"), deletePatient);

export default router;
