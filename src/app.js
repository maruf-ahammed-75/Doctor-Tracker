import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/index.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("dev"));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing middleware
app.use(cookieParser());

// Mount API routes under /api
app.use("/api", apiRouter);

// 404 handler for unknown routes
app.use(notFound);

// Centralized error handling middleware (must be last)
app.use(errorHandler);

export default app;
