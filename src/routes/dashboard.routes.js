import { Router } from "express";
import {
  getSummary,
  getPatientsPerDoctor,
  getStatsByDate,
} from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all dashboard routes
router.use(protect);

router.get("/summary", getSummary);
router.get("/patients-per-doctor", getPatientsPerDoctor);
router.get("/stats-by-date", getStatsByDate);

export default router;
