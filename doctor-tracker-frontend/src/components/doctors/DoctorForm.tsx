"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorFormSchema, DoctorFormData } from "@/lib/validations/doctor";
import {
  X,
  Stethoscope,
  Building,
  Phone,
  Mail,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface DoctorFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<DoctorFormData>;
  onSubmit: (data: DoctorFormData) => Promise<void> | void;
  onClose: () => void;
  isLoading?: boolean;
  serverError?: string | null;
}

export function DoctorForm({
  isOpen,
  mode,
  initialValues,
  onSubmit,
  onClose,
  isLoading = false,
  serverError,
}: DoctorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  // Reset or populate fields when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        reset({
          name: initialValues.name || "",
          specialization: initialValues.specialization || "",
          hospital: initialValues.hospital || "",
          phone: initialValues.phone || "",
          email: initialValues.email || "",
        });
      } else {
        reset({
          name: "",
          specialization: "",
          hospital: "",
          phone: "",
          email: "",
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
        aria-labelledby="doctor-form-title"
        className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="doctor-form-title"
                className="text-base font-bold text-slate-900 leading-tight"
              >
                {mode === "create" ? "Add New Practitioner" : "Edit Practitioner Profile"}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === "create"
                  ? "Register a new doctor into the clinical network"
                  : "Update practitioner contact and hospital affiliation details"}
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
          {/* Doctor Name */}
          <div>
            <label
              htmlFor="doctor-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
            >
              Full Name *
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="doctor-name"
                type="text"
                placeholder="Dr. Eleanor Vance"
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

          {/* Specialization & Hospital Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="doctor-specialization"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Specialization *
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <input
                  id="doctor-specialization"
                  type="text"
                  placeholder="Cardiology"
                  {...register("specialization")}
                  className={`block w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                    errors.specialization
                      ? "border-rose-400 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                />
              </div>
              {errors.specialization && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="doctor-hospital"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Hospital / Clinic *
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  id="doctor-hospital"
                  type="text"
                  placeholder="Metropolitan Hospital"
                  {...register("hospital")}
                  className={`block w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                    errors.hospital
                      ? "border-rose-400 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                />
              </div>
              {errors.hospital && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.hospital.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Details Grid: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="doctor-phone"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Phone Number *
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="doctor-phone"
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  {...register("phone")}
                  className={`block w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-rose-400 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="doctor-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1"
              >
                Email Address *
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="doctor-email"
                  type="email"
                  placeholder="vance@metropolitan.org"
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
              id="submit-doctor-btn"
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50 transition-all duration-150"
            >
              {isLoading && <Loader2 className="animate-spin h-3.5 w-3.5" />}
              <span>{mode === "create" ? "Add Doctor" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorForm;
