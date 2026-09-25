import { Doctor } from "./doctor";

export interface Patient {
  _id: string;
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  condition?: string;
  phone?: string;
  email?: string;
  doctor: Doctor | string;
  visitDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientInput {
  name: string;
  age?: number;
  gender?: "male" | "female" | "other";
  condition?: string;
  phone?: string;
  email?: string;
  visitDate?: string;
}

export interface PatientFilterParams {
  search?: string;
  condition?: string;
  doctorId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
