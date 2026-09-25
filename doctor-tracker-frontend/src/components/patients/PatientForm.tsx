"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "@/lib/validations/patient";
import {
  X,
  User,
  HeartPulse,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
  Users,
} from "lucide-react";

export interface PatientFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValues?:
    | Partial<Omit<PatientFormData, "age"> & { age?: number | string }>
    | Record<string, any>;
  onSubmit: (data: PatientFormData) => Promise<void> | void;
  onClose: () => void;
  isLoading?: boolean;
  serverError?: string | null;
  doctorName?: string;
}

export function PatientForm({
  isOpen,
  mode,
  initialValues,
  onSubmit,
  onClose,
  isLoading = false,
  serverError,
  doctorName,
}: PatientFormProps) {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      condition: "",
      phone: "",
      email: "",
      visitDate: getTodayDate(),
    },
  });

  // Reset or populate fields when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        reset({
          name: initialValues.name || "",
          age:
            initialValues.age !== undefined && initialValues.age !== null
              ? String(initialValues.age)
              : "",
          gender: initialValues.gender || "",
          condition: initialValues.condition || "",
          phone: initialValues.phone || "",
          email: initialValues.email || "",
          visitDate: initialValues.visitDate
            ? initialValues.visitDate.split("T")[0]
            : getTodayDate(),
        });
      } else {
        reset({
          name: "",
          age: "",
          gender: "",
          condition: "",
          phone: "",
          email: "",
          visitDate: getTodayDate(),
        });
      }
    }
  }, [isOpen, initialValues, reset]);

  // Lock body scroll on modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={isLoading ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-form-title"
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="patient-form-title"
                className="text-base font-bold text-slate-900 leading-tight"
              >
                {mode === "create" ? "Assign New Patient" : "Edit Patient Record"}
              </h3>
              <p className="text-xs text-slate-500">
                {doctorName
                  ? `Clinical intake under ${doctorName}`
                  : "Clinical intake and medical details"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Error Alert Banner */}
        {serverError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5 shrink-0">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-800">Submission Error</p>
              <p className="mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1" noValidate>
          {/* Patient Name */}
          <div>
            <label
              htmlFor="patient-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              Patient Name *
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="patient-name"
                type="text"
                placeholder="Eleanor Rigby"
                {...register("name")}
                className={`block w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-rose-400 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
            )}
          </div>

          {/* Age & Gender Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="patient-age"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Age
              </label>
              <input
                id="patient-age"
                type="number"
                min="0"
                max="150"
                placeholder="42"
                {...register("age")}
                className={`block w-full px-3 py-2 text-sm rounded-xl border bg-white text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.age
                    ? "border-rose-400 focus:ring-rose-500/20"
                    : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
              {errors.age && (
                <p className="mt-1 text-xs text-rose-500">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="patient-gender"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Gender
              </label>
              <select
                id="patient-gender"
                {...register("gender")}
                className="block w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="">Unspecified</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Clinical Condition */}
          <div>
            <label
              htmlFor="patient-condition"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              Medical Condition / Diagnosis
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <HeartPulse className="h-4 w-4" />
              </div>
              <input
                id="patient-condition"
                type="text"
                placeholder="Hypertension, Type 2 Diabetes..."
                {...register("condition")}
                className="block w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {/* Contact Details Grid: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="patient-phone"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Phone Number
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="patient-phone"
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  {...register("phone")}
                  className="block w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="patient-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Email Address
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="patient-email"
                  type="email"
                  placeholder="patient@example.com"
                  {...register("email")}
                  className={`block w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-rose-400 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Visit Date */}
          <div>
            <label
              htmlFor="patient-visit-date"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              Consultation / Visit Date
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                id="patient-visit-date"
                type="date"
                {...register("visitDate")}
                className="block w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 font-medium shadow-2xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-patient-btn"
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 transition-all duration-150"
            >
              {isLoading && <Loader2 className="animate-spin h-3.5 w-3.5" />}
              <span>{mode === "create" ? "Assign Patient" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;
