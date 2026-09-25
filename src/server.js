import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas, then start HTTP server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Doctor Tracker Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use. Please close the process using it or change PORT in .env`);
    } else {
      console.error(`❌ Server error:`, error);
    }
    process.exit(1);
  });
};

startServer();
