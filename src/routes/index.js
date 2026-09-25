import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./auth.routes.js";
import doctorRoutes from "./doctor.routes.js";
import patientRoutes from "./patient.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

// Mount Auth routes under /api/auth
router.use("/auth", authRoutes);

// Mount Doctor routes under /api/doctors (includes nested /:id/patients routes)
router.use("/doctors", doctorRoutes);

// Mount Patient routes under /api/patients
router.use("/patients", patientRoutes);

// Mount Dashboard routes under /api/dashboard
router.use("/dashboard", dashboardRoutes);

/**
 * @route   GET /api/health
 * @desc    Health check route confirming server and MongoDB connection status
 * @access  Public
 */
router.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const isConnected = dbState === 1;

  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? "ok" : "degraded",
    message: "Doctor Tracker API is online",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStatusMap[dbState] || "unknown",
      readyState: dbState,
    },
  });
});

export default router;
