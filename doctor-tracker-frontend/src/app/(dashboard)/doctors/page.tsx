"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useDoctors,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from "@/lib/hooks/useDoctors";
import { useToast } from "@/lib/context/ToastContext";
import { Doctor } from "@/types/doctor";
import { DoctorFormData } from "@/lib/validations/doctor";
import DataTable, { Column } from "@/components/common/DataTable";
import Pagination from "@/components/common/Pagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorForm from "@/components/doctors/DoctorForm";
import {
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Building,
  Phone,
  Mail,
  User,
} from "lucide-react";

export default function DoctorsPage() {
  const router = useRouter();
  const toast = useToast();

  // Set browser tab title
  useEffect(() => {
    document.title = "Doctors | Doctor Tracker";
  }, []);

  // Filter & Pagination States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Modals & Action States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // Filter query parameters object
  const filterParams = {
    page,
    limit,
    ...(search ? { search } : {}),
    ...(specialization ? { specialization } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  };

  // Queries & Mutations
  const { data, isLoading, isError, error, refetch } =
    useDoctors(filterParams);
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const deleteMutation = useDeleteDoctor();

  // Filter Handlers (All reset to page 1)
  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleSpecializationChange = (newSpec: string) => {
    setSpecialization(newSpec);
    setPage(1);
  };

  const handleDateRangeChange = (newFrom: string, newTo: string) => {
    setFrom(newFrom);
    setTo(newTo);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSpecialization("");
    setFrom("");
    setTo("");
    setPage(1);
  };

  // Modal Open Handlers
  const handleOpenCreateModal = () => {
    setSelectedDoctor(null);
    setFormMode("create");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, doctor: Doctor) => {
    e.stopPropagation();
    setSelectedDoctor(doctor);
    setFormMode("edit");
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (e: React.MouseEvent, doctor: Doctor) => {
    e.stopPropagation();
    setDoctorToDelete(doctor);
    setIsDeleteDialogOpen(true);
  };

  // Submit Handler for Create / Edit
  const handleFormSubmit = async (formData: DoctorFormData) => {
    setFormError(null);
    try {
      if (formMode === "create") {
        await createMutation.mutateAsync(formData);
        setIsFormOpen(false);
        toast.success(
          "Doctor Registered",
          `Dr. ${formData.name} was successfully registered.`
        );
      } else if (selectedDoctor) {
        await updateMutation.mutateAsync({
          id: selectedDoctor._id,
          data: formData,
        });
        setIsFormOpen(false);
        toast.success(
          "Profile Updated",
          `Profile for Dr. ${formData.name} was updated.`
        );
      }
    } catch (err: any) {
      const message =
        err?.customMessage ||
        err?.response?.data?.message ||
        "An unexpected error occurred while saving the doctor.";
      setFormError(message);
      toast.error("Registration Failed", message);
    }
  };

  // Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;
    try {
      await deleteMutation.mutateAsync(doctorToDelete._id);
      setIsDeleteDialogOpen(false);
      toast.success(
        "Doctor Removed",
        `Dr. ${doctorToDelete.name} was removed from the registry.`
      );
      setDoctorToDelete(null);
    } catch (err: any) {
      const message =
        err?.customMessage ||
        err?.response?.data?.message ||
        "Failed to delete doctor. Please try again.";
      toast.error("Deletion Failed", message);
    }
  };

  // Table Columns Definition
  const columns: Column<Doctor>[] = [
    {
      key: "name",
      label: "Practitioner",
      render: (doctor) => (
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
            {doctor.name ? doctor.name.replace(/^Dr\.\s*/i, "").slice(0, 2).toUpperCase() : "DR"}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block hover:text-teal-600 transition-colors">
              {doctor.name}
            </span>
            <span className="text-xs text-slate-400 block sm:hidden">
              {doctor.specialization}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      label: "Specialization",
      className: "hidden sm:table-cell",
      headerClassName: "hidden sm:table-cell",
      render: (doctor) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
          {doctor.specialization}
        </span>
      ),
    },
    {
      key: "hospital",
      label: "Hospital / Clinic",
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
      render: (doctor) => (
        <div className="flex items-center space-x-1.5 text-slate-600 text-xs">
          <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[180px]">{doctor.hospital}</span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      className: "hidden lg:table-cell",
      headerClassName: "hidden lg:table-cell",
      render: (doctor) => (
        <div className="flex items-center space-x-1.5 text-slate-600 text-xs">
          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{doctor.phone}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      className: "hidden xl:table-cell",
      headerClassName: "hidden xl:table-cell",
      render: (doctor) => (
        <div className="flex items-center space-x-1.5 text-slate-600 text-xs">
          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{doctor.email}</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Registered",
      className: "hidden md:table-cell",
      headerClassName: "hidden md:table-cell",
      render: (doctor) => (
        <span className="text-xs text-slate-500">
          {new Date(doctor.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      headerClassName: "text-right",
      render: (doctor) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            title="Edit Doctor"
            onClick={(e) => handleOpenEditModal(e, doctor)}
            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Delete Doctor"
            onClick={(e) => handleOpenDeleteModal(e, doctor)}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header: Title + Add Doctor Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Doctors Directory
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            View, search, filter, and manage licensed practitioners in the hospital network.
          </p>
        </div>

        <button
          type="button"
          id="add-doctor-btn"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all duration-150 shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Search & Filters */}
      <DoctorFilters
        search={search}
        specialization={specialization}
        from={from}
        to={to}
        onSearchChange={handleSearchChange}
        onSpecializationChange={handleSpecializationChange}
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
              Failed to load doctors
            </h3>
            <p className="mt-1 text-xs text-rose-700">
              {(error as any)?.customMessage ||
                "Could not establish a connection to the clinical database. Please verify your backend server."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-rose-300 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 shadow-2xs transition-colors"
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
            emptyMessage="No doctors found"
            emptySubtitle={
              search || specialization || from || to
                ? "No practitioners matched your filter parameters. Try clearing your filters."
                : "No doctors have been registered in the database yet. Click 'Add Doctor' to create one."
            }
            onRowClick={(doctor) => router.push(`/doctors/${doctor._id}`)}
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

      {/* Add / Edit Doctor Form Modal */}
      <DoctorForm
        isOpen={isFormOpen}
        mode={formMode}
        initialValues={
          selectedDoctor
            ? {
                name: selectedDoctor.name,
                specialization: selectedDoctor.specialization,
                hospital: selectedDoctor.hospital,
                phone: selectedDoctor.phone,
                email: selectedDoctor.email,
              }
            : undefined
        }
        isLoading={createMutation.isPending || updateMutation.isPending}
        serverError={formError}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Doctor"
        message={
          doctorToDelete
            ? `Are you sure you want to delete ${doctorToDelete.name}? This will remove them from the clinical registry.`
            : "Are you sure you want to delete this doctor?"
        }
        confirmLabel="Delete Doctor"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setDoctorToDelete(null);
        }}
      />
    </div>
  );
}
