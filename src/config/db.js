import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 * Connects using process.env.MONGODB_URI
 * Logs a clear success message on connect and a clear error message (exiting process) on failure.
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error("❌ MongoDB connection error: MONGODB_URI is not defined in environment variables.");
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
