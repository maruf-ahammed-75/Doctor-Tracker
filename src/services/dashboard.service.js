import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";

/**
 * 1. Get dashboard summary counts (totalDoctors, totalPatients)
 * Executes concurrently at the DB level using Promise.all
 * @returns {Promise<{ totalDoctors: number, totalPatients: number }>}
 */
export const getDashboardSummary = async () => {
  const [totalDoctors, totalPatients] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
  ]);

  return {
    totalDoctors,
    totalPatients,
  };
};

/**
 * 2. Get patients count per doctor using a single aggregation pipeline
 * Pipeline: $group -> $lookup -> $unwind -> $project -> $sort
 * Avoids N+1 queries by joining at DB level
 * @returns {Promise<Array<{ doctorId: string, doctorName: string, specialization: string, hospital: string, patientCount: number }>>}
 */
export const getPatientsPerDoctor = async () => {
  const pipeline = [
    // Group patients by doctor reference and count
    {
      $group: {
        _id: "$doctor",
        patientCount: { $sum: 1 },
      },
    },
    // Join with doctors collection
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    // Unwind doctor array to flatten document
    {
      $unwind: "$doctor",
    },
    // Project cleanly into required output shape
    {
      $project: {
        _id: 0,
        doctorId: "$_id",
        doctorName: "$doctor.name",
        specialization: "$doctor.specialization",
        hospital: "$doctor.hospital",
        patientCount: 1,
      },
    },
    // Sort by patientCount descending
    {
      $sort: { patientCount: -1 },
    },
  ];

  return Patient.aggregate(pipeline);
};

/**
 * 3. Get patient visit stats grouped by date (day or month)
 * Aggregation pipeline truncates visitDate with $dateToString and groups
 * @param {string} groupBy - "day" or "month" (default: "day")
 * @returns {Promise<Array<{ date: string, count: number }>>}
 */
export const getStatsByDate = async (groupBy = "day") => {
  const isMonth = groupBy?.toLowerCase() === "month";
  const dateFormat = isMonth ? "%Y-%m" : "%Y-%m-%d";

  const pipeline = [
    // Filter to documents with valid visitDate
    {
      $match: {
        visitDate: { $ne: null },
      },
    },
    // Group by formatted date string
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$visitDate",
          },
        },
        count: { $sum: 1 },
      },
    },
    // Project into standard { date, count } shape
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
    // Sort chronologically ascending
    {
      $sort: { date: 1 },
    },
  ];

  return Patient.aggregate(pipeline);
};

export default {
  getDashboardSummary,
  getPatientsPerDoctor,
  getStatsByDate,
};
