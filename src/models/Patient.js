import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    age: {
      type: Number,
      min: [0, "Age must be a positive number"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be either male, female, or other",
      },
    },
    condition: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor reference is required"],
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Section 3.4 Indexes:
// 1. Text index for full-text search across name and condition
patientSchema.index({ name: "text", condition: "text" });

// 2. Index on doctor reference
patientSchema.index({ doctor: 1 });

// 3. Index on visitDate (descending) for date-wise queries
patientSchema.index({ visitDate: -1 });

// 4. Compound index for patients-per-doctor + date filter performance
patientSchema.index({ doctor: 1, visitDate: -1 });

export const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
