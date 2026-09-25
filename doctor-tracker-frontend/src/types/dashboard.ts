export interface DashboardSummary {
  totalDoctors: number;
  totalPatients: number;
}

export interface PatientsPerDoctorStat {
  doctorId: string;
  doctorName: string;
  specialization: string;
  hospital: string;
  patientCount: number;
}

export interface DateStat {
  date: string;
  count: number;
}
