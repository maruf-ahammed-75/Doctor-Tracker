"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  usePatients,
  useUpdatePatient,
  useDeletePatient,
} from "@/lib/hooks/usePatients";
import { useToast } from "@/lib/context/ToastContext";
import { Patient } from "@/types/patient";
import { PatientFormData } from "@/lib/validations/patient";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import PatientFilters from "@/components/patients/PatientFilters";
import PatientForm from "@/components/patients/PatientForm";
import {
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  HeartPulse,
  Stethoscope,
  Users,
} from "lucide-react";

export default function PatientsPage() {
  const toast = useToast();

  // Set browser tab title
  useEffect(() => {
    document.title = "Patients | Doctor Tracker";
  }, []);

  // Filter & Pagination States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Modals & Action States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Filter params object
  const filterParams = {
    page,
    limit,
    ...(search ? { search } : {}),
    ...(condition ? { condition } : {}),
    ...(doctorId ? { doctorId } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  };

  // Queries & Mutations
  const { data, isLoading, isError, error, refetch } = usePatients(filterParams);
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  // Filter Handlers (All reset to page 1)
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleConditionChange = (newCondition: string) => {
    setCondition(newCondition);
    setPage(1);
  };

  const handleDoctorChange = (newDoctorId: string) => {
    setDoctorId(newDoctorId);
    setPage(1);
  };

  const handleDateRangeChange = (newFrom: string, newTo: string) => {
    setFrom(newFrom);
    setTo(newTo);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCondition("");
    setDoctorId("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  // Edit Action Handlers
  const handleOpenEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormError(null);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (formData: PatientFormData) => {
    if (!selectedPatient) return;
    setFormError(null);
    try {
      await updateMutation.mutateAsync({
        id: selectedPatient._id,
        data: {
          name: formData.name,
          age: formData.age ? Number(formData.age) : undefined,
          gender: (formData.gender as any) || undefined,
          condition: formData.condition || undefined,
          phone: formData.phone || undefined,
          email: formData.email || undefined,
          visitDate: formData.visitDate || undefined,
        },
      });
      setIsEditOpen(false);
      toast.success(
        "Record Updated",
        `Patient record for ${formData.name} was updated successfully.`
      );
      setSelectedPatient(null);
    } catch (err: any) {
      const message =
        err?.customMessage ||
        err?.response?.data?.message ||
        "Failed to update patient record. Please check the details and try again.";
      setFormError(message);
      toast.error("Update Failed", message);
    }
  };

  // Delete Action Handlers
  const handleOpenDelete = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    try {
      const docId =
        typeof patientToDelete.doctor === "object"
          ? (patientToDelete.doctor as any)?._id
          : patientToDelete.doctor;

      await deleteMutation.mutateAsync({
        id: patientToDelete._id,
        doctorId: docId,
      });

      setIsDeleteDialogOpen(false);
      toast.success(
        "Patient Deleted",
        `Patient ${patientToDelete.name} was removed successfully.`
      );
      setPatientToDelete(null);
    } catch (err: any) {
      const message =
        err?.customMessage ||
        err?.response?.data?.message ||
        "Failed to delete patient. Please try again.";
      toast.error("Deletion Failed", message);
    }
  };

  // Table Columns Definition: Name, Age, Gender, Condition, Doctor, Visit Date, Actions
  const columns: Column<Patient>[] = [
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
          {patient.age !== undefined && patient.age !== null
            ? `${patient.age} yrs`
            : "—"}
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
            <HeartPulse className="h-3 w-3 mr-1 text-cyan-600 shrink-0" />
            <span>{patient.condition}</span>
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">None noted</span>
        ),
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (patient) => {
        const doc =
          typeof patient.doctor === "object" && patient.doctor !== null
            ? patient.doctor
            : null;

        if (doc) {
          return (
            <Link
              href={`/doctors/${doc._id}`}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
              title={`View ${doc.name}'s profile`}
            >
              <Stethoscope className="h-3.5 w-3.5 text-teal-500 shrink-0" />
              <span className="truncate max-w-[150px]">{doc.name}</span>
            </Link>
          );
        }

        return <span className="text-xs text-slate-400 italic">Unassigned</span>;
      },
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
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            title="Edit Patient"
            onClick={() => handleOpenEdit(patient)}
            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Delete Patient"
            onClick={() => handleOpenDelete(patient)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header: Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Patients Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              {data?.pagination?.total || 0} Total
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Dedicated registry of all clinical intake records across doctors,
            searchable by diagnosis, attending practitioner, and date.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <PatientFilters
        search={search}
        condition={condition}
        doctorId={doctorId}
        from={from}
        to={to}
        onSearchChange={handleSearchChange}
        onConditionChange={handleConditionChange}
        onDoctorChange={handleDoctorChange}
        onDateRangeChange={handleDateRangeChange}
        onReset={handleResetFilters}
      />

      {/* Error State */}
      {isError ? (
        <div className="p-8 bg-rose-50/70 border border-rose-200 rounded-2xl text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-rose-900">
              Failed to load patients
            </h3>
            <p className="mt-1 text-xs text-rose-700">
              {(error as any)?.customMessage ||
                "Could not establish a connection to the patient records database. Please verify your backend server."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-rose-300 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : (
        /* Data Table & Pagination Container */
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={data?.data || []}
            isLoading={isLoading}
            emptyMessage="No patients found"
            emptySubtitle={
              search || condition || doctorId || from || to
                ? "No clinical records matched your filter criteria. Try clearing or broadening your search."
                : "No patient records have been assigned in the database yet. Patients are assigned under practitioners from the Doctor Detail page."
            }
          />

          {/* Pagination */}
          {!isLoading && data?.data && data.data.length > 0 && (
            <Pagination
              page={page}
              totalPages={data?.pagination?.totalPages || 1}
              totalItems={data?.pagination?.total}
              limit={limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      )}

      {/* Edit Patient Modal */}
      {isEditOpen && selectedPatient && (
        <PatientForm
          isOpen={isEditOpen}
          mode="edit"
          initialValues={{
            name: selectedPatient.name,
            age: selectedPatient.age,
            gender: selectedPatient.gender,
            condition: selectedPatient.condition,
            phone: selectedPatient.phone,
            email: selectedPatient.email,
            visitDate: selectedPatient.visitDate,
          }}
          isLoading={updateMutation.isPending}
          serverError={formError}
          onSubmit={handleEditSubmit}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedPatient(null);
            setFormError(null);
          }}
        />
      )}

      {/* Delete Patient Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Patient Record"
        message={
          patientToDelete
            ? `Are you sure you want to permanently delete the patient record for ${patientToDelete.name}? This action cannot be undone.`
            : "Are you sure you want to delete this patient record?"
        }
        confirmLabel="Delete Patient"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setPatientToDelete(null);
        }}
      />
    </div>
  );
}
