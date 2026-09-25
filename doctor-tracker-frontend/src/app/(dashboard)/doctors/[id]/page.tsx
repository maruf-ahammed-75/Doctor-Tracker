"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  useDoctor,
  useDoctorPatients,
  useAddPatientToDoctor,
  useRemovePatientFromDoctor,
} from "@/lib/hooks/usePatients";
import { useToast } from "@/lib/context/ToastContext";
import { Patient } from "@/types/patient";
import { PatientFormData } from "@/lib/validations/patient";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/SearchInput";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import PatientForm from "@/components/patients/PatientForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  ArrowLeft,
  Building,
  Phone,
  Mail,
  Calendar,
  Plus,
  UserMinus,
  AlertCircle,
  Stethoscope,
  HeartPulse,
  User,
} from "lucide-react";

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const doctorId = (params?.id as string) || "";

  // Patient Search & Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  // Modals & Action States
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [patientFormError, setPatientFormError] = useState<string | null>(null);

  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [patientToRemove, setPatientToRemove] = useState<Patient | null>(null);

  // Queries & Mutations
  const {
    data: doctor,
    isLoading: isDoctorLoading,
    isError: isDoctorError,
    error: doctorError,
  } = useDoctor(doctorId);

  // Update browser tab title when doctor loads
  useEffect(() => {
    if (doctor?.name) {
      document.title = `${doctor.name} | Doctor Tracker`;
    } else {
      document.title = "Doctor Profile | Doctor Tracker";
    }
  }, [doctor]);

  const {
    data: patientsData,
    isLoading: isPatientsLoading,
    isError: isPatientsError,
  } = useDoctorPatients(doctorId, {
    page,
    limit,
    ...(search ? { search } : {}),
  });

  const addPatientMutation = useAddPatientToDoctor(doctorId);
  const removePatientMutation = useRemovePatientFromDoctor(doctorId);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleAddPatientSubmit = async (formData: PatientFormData) => {
    setPatientFormError(null);
    try {
      await addPatientMutation.mutateAsync({
        name: formData.name,
        age: formData.age ? Number(formData.age) : undefined,
        gender: (formData.gender as any) || undefined,
        condition: formData.condition || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        visitDate: formData.visitDate || undefined,
      });
      setIsAddPatientOpen(false);
      toast.success(
        "Patient Assigned",
        `Patient ${formData.name} was successfully assigned to Dr. ${doctor?.name || "the practitioner"}.`
      );
    } catch (err: any) {
      const message =
        err?.customMessage ||
        err?.response?.data?.message ||
        "Failed to assign patient. Please try again.";
      setPatientFormError(message);
      toast.error("Assignment Failed", message);
    }
  };

  const handleRemoveConfirm = async () => {
    if (!patientToRemove) return;
    try {
      await removePatientMutation.mutateAsync(patientToRemove._id);
      setIsRemoveDialogOpen(false);
      toast.success(
        "Patient Removed",
        `Patient ${patientToRemove.name} was removed from this doctor's care.`
      );
      setPatientToRemove(null);
    } catch (err: any) {
      const message =
        err?.customMessage ||
        err?.response?.data?.message ||
        "Failed to remove patient. Please try again.";
      toast.error("Removal Failed", message);
    }
  };

  // Table Columns Definition: Name, Age, Gender, Condition, Visit Date, Actions
  const patientColumns: Column<Patient>[] = [
    {
      key: "name",
      label: "Name",
      render: (patient) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
            {patient.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">
              {patient.name}
            </span>
            {(patient.phone || patient.email) && (
              <span className="text-xs text-slate-400 block">
                {patient.phone || patient.email}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "age",
      label: "Age",
      render: (patient) => (
        <span className="text-xs text-slate-700 font-medium">
          {patient.age !== undefined && patient.age !== null ? `${patient.age} yrs` : "—"}
        </span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (patient) =>
        patient.gender ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-slate-100 text-slate-700 border border-slate-200">
            {patient.gender}
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      key: "condition",
      label: "Condition",
      render: (patient) =>
        patient.condition ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-800 border border-cyan-200/60">
            <HeartPulse className="h-3 w-3 mr-1 text-cyan-600" />
            <span>{patient.condition}</span>
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">None noted</span>
        ),
    },
    {
      key: "visitDate",
      label: "Visit Date",
      render: (patient) => (
        <span className="text-xs text-slate-600">
          {patient.visitDate
            ? new Date(patient.visitDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      headerClassName: "text-right",
      render: (patient) => (
        <button
          type="button"
          title="Remove from Doctor"
          onClick={() => {
            setPatientToRemove(patient);
            setIsRemoveDialogOpen(true);
          }}
          className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
        >
          <UserMinus className="h-3.5 w-3.5" />
          <span>Remove</span>
        </button>
      ),
    },
  ];

  // Loading Screen for Doctor Profile
  if (isDoctorLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <LoadingSpinner size={32} />
        <p className="text-sm font-medium text-slate-500">
          Retrieving practitioner records...
        </p>
      </div>
    );
  }

  // Doctor Not Found Error Screen
  if (isDoctorError || !doctor) {
    return (
      <div className="space-y-6">
        <Link
          href="/doctors"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Doctors Directory</span>
        </Link>

        <div className="p-8 bg-rose-50/70 border border-rose-200 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-900">
              Doctor Not Found
            </h3>
            <p className="mt-1 text-xs text-rose-700">
              {(doctorError as any)?.customMessage ||
                `The practitioner with ID "${doctorId}" does not exist or has been removed from the registry.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/doctors")}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-rose-300 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 shadow-2xs transition-colors"
          >
            <span>Return to Directory</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/doctors"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-teal-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Doctors</span>
        </Link>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60">
          ID: {doctor._id.slice(-6)}
        </span>
      </div>

      {/* Doctor Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-white/10 shrink-0">
              {doctor.name ? doctor.name.replace(/^Dr\.\s*/i, "").slice(0, 2).toUpperCase() : "DR"}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {doctor.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  {doctor.specialization}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 flex items-center space-x-1.5">
                <Building className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>{doctor.hospital}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            id="assign-patient-btn"
            onClick={() => {
              setPatientFormError(null);
              setIsAddPatientOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all duration-150 shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Patient</span>
          </button>
        </div>

        {/* Card Contact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/50 p-4 sm:p-6 text-xs text-slate-600">
          <div className="p-3 space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 block">
              Phone Number
            </span>
            <div className="flex items-center space-x-2 text-slate-800 font-medium">
              <Phone className="h-3.5 w-3.5 text-teal-600" />
              <span>{doctor.phone}</span>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 block">
              Email Address
            </span>
            <div className="flex items-center space-x-2 text-slate-800 font-medium truncate">
              <Mail className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{doctor.email}</span>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 block">
              Affiliated Facility
            </span>
            <div className="flex items-center space-x-2 text-slate-800 font-medium">
              <Building className="h-3.5 w-3.5 text-teal-600" />
              <span className="truncate">{doctor.hospital}</span>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 block">
              Registered On
            </span>
            <div className="flex items-center space-x-2 text-slate-800 font-medium">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              <span>
                {new Date(doctor.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Assigned Patients
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                {patientsData?.pagination?.total || 0} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active patient consultations under Dr. {doctor.name}
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <SearchInput
              value={search}
              onSearch={handleSearchChange}
              placeholder="Search patients by name or condition..."
              className="w-full"
            />
          </div>
        </div>

        {/* Patients Table */}
        <DataTable
          columns={patientColumns}
          data={patientsData?.data || []}
          isLoading={isPatientsLoading}
          emptyMessage="No patients assigned"
          emptySubtitle={
            search
              ? "No patients matched your search query."
              : `Dr. ${doctor.name} does not have any assigned patients yet. Click "Add Patient" to register one.`
          }
        />

        {/* Pagination */}
        {!isPatientsLoading &&
          patientsData?.data &&
          patientsData.data.length > 0 && (
            <Pagination
              page={page}
              totalPages={patientsData?.pagination?.totalPages || 1}
              totalItems={patientsData?.pagination?.total}
              limit={limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
      </div>

      {/* Add Patient Modal */}
      <PatientForm
        isOpen={isAddPatientOpen}
        mode="create"
        doctorName={doctor.name}
        isLoading={addPatientMutation.isPending}
        serverError={patientFormError}
        onSubmit={handleAddPatientSubmit}
        onClose={() => setIsAddPatientOpen(false)}
      />

      {/* Remove Patient Confirmation Modal */}
      <ConfirmDialog
        isOpen={isRemoveDialogOpen}
        title="Remove Patient"
        message={
          patientToRemove
            ? `Are you sure you want to remove ${patientToRemove.name} from Dr. ${doctor.name}? This will remove the patient record from this doctor's care.`
            : "Are you sure you want to remove this patient?"
        }
        confirmLabel="Remove Patient"
        isDestructive={true}
        isLoading={removePatientMutation.isPending}
        onConfirm={handleRemoveConfirm}
        onCancel={() => {
          setIsRemoveDialogOpen(false);
          setPatientToRemove(null);
        }}
      />
    </div>
  );
}
