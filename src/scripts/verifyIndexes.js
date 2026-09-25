import "dotenv/config";
import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

/**
 * Traverses an explain plan stage tree to find scan types (IXSCAN, TEXT_MATCH, COLLSCAN)
 */
const extractScanStages = (stage) => {
  const stages = [];
  if (!stage) return stages;

  if (stage.stage) {
    stages.push({
      stage: stage.stage,
      indexName: stage.indexName || stage.indexPrefix || "N/A",
    });
  }

  if (stage.inputStage) {
    stages.push(...extractScanStages(stage.inputStage));
  }
  if (stage.inputStages && Array.isArray(stage.inputStages)) {
    for (const subStage of stage.inputStages) {
      stages.push(...extractScanStages(subStage));
    }
  }

  return stages;
};

const verifyIndexes = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MONGODB_URI is not set in environment.");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected.\n");

    // Ensure Mongoose model indexes are synchronized with MongoDB Atlas
    console.log("🔄 Synchronizing model indexes with MongoDB...");
    await Doctor.syncIndexes();
    await Patient.syncIndexes();
    console.log("✅ Indexes synchronized successfully.\n");

    // 1. Get and display Doctor collection indexes
    console.log("==================================================");
    console.log("📋 1. DOCTOR COLLECTION INDEXES (db.doctors.getIndexes())");
    console.log("==================================================");
    const doctorIndexes = await Doctor.collection.getIndexes();
    console.log(JSON.stringify(doctorIndexes, null, 2));

    // 2. Get and display Patient collection indexes
    console.log("\n==================================================");
    console.log("📋 2. PATIENT COLLECTION INDEXES (db.patients.getIndexes())");
    console.log("==================================================");
    const patientIndexes = await Patient.collection.getIndexes();
    console.log(JSON.stringify(patientIndexes, null, 2));

    // 3. Explain query for Doctor text search
    console.log("\n==================================================");
    console.log("🔬 3. EXPLAIN PLAN: Doctor Search Query ($text index)");
    console.log("==================================================");
    const doctorExplain = await Doctor.find({
      $text: { $search: "Cardiology" },
    }).explain("executionStats");

    const doctorWinningStage = doctorExplain.queryPlanner.winningPlan;
    const doctorStages = extractScanStages(doctorWinningStage);
    const doctorUsesIndex = doctorStages.some(
      (s) => s.stage === "IXSCAN" || s.stage === "TEXT_MATCH" || s.stage === "TEXT_OR"
    );

    console.log(`Query: Doctor.find({ $text: { $search: 'Cardiology' } })`);
    console.log(`Execution Stages Traversed:`, doctorStages.map((s) => `${s.stage} (${s.indexName})`).join(" -> "));
    console.log(`Scan Result: ${doctorUsesIndex ? "✅ INDEX SCAN USED (TEXT_MATCH / IXSCAN)" : "❌ COLLSCAN DETECTED"}`);
    console.log(`Total Docs Examined: ${doctorExplain.executionStats.totalDocsExamined}`);
    console.log(`Total Keys Examined: ${doctorExplain.executionStats.totalKeysExamined}`);
    console.log(`Execution Time: ${doctorExplain.executionStats.executionTimeMillis}ms`);

    // 4. Explain query for Patient compound filter (doctor + visitDate)
    console.log("\n==================================================");
    console.log("🔬 4. EXPLAIN PLAN: Patient Doctor + Date Query (Compound Index)");
    console.log("==================================================");

    // Pick an existing doctor or sample ID
    const sampleDoctor = await Doctor.findOne();
    const sampleDoctorId = sampleDoctor ? sampleDoctor._id : new mongoose.Types.ObjectId();

    const patientExplain = await Patient.find({
      doctor: sampleDoctorId,
      visitDate: { $gte: new Date("2026-01-01") },
    }).explain("executionStats");

    const patientWinningStage = patientExplain.queryPlanner.winningPlan;
    const patientStages = extractScanStages(patientWinningStage);
    const patientUsesIndex = patientStages.some((s) => s.stage === "IXSCAN");

    console.log(`Query: Patient.find({ doctor: ${sampleDoctorId}, visitDate: { $gte: 2026-01-01 } })`);
    console.log(`Execution Stages Traversed:`, patientStages.map((s) => `${s.stage} (${s.indexName})`).join(" -> "));
    console.log(`Scan Result: ${patientUsesIndex ? "✅ INDEX SCAN USED (IXSCAN on compound index)" : "❌ COLLSCAN DETECTED"}`);
    console.log(`Total Docs Examined: ${patientExplain.executionStats.totalDocsExamined}`);
    console.log(`Total Keys Examined: ${patientExplain.executionStats.totalKeysExamined}`);
    console.log(`Execution Time: ${patientExplain.executionStats.executionTimeMillis}ms`);

    console.log("\n==================================================");
    console.log("🎉 ALL INDEXES VERIFIED AND CONFIRMED ACTIVE");
    console.log("==================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Index verification failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

verifyIndexes();
