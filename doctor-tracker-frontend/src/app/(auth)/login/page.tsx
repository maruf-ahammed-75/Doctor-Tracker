"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/context/ToastContext";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set browser tab title
  useEffect(() => {
    document.title = "Login | Doctor Tracker";
  }, []);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success("Welcome back!", "Signed in successfully.");
      router.replace("/dashboard");
    } catch (err: any) {
      const message =
        err?.customMessage ||
        err?.response?.data?.message ||
        "Failed to sign in. Please verify your credentials.";
      setServerError(message);
      toast.error("Authentication Failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setValue("email", "admin@doctortracker.com", { shouldValidate: true });
    setValue("password", "Admin123!", { shouldValidate: true });
    setServerError(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
          <span className="text-sm font-medium text-slate-400">Loading session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* App Logo & Header */}
        <div className="flex justify-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/25 ring-4 ring-teal-500/20">
            <Activity className="h-8 w-8 text-slate-950" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-white">
          Doctor Tracker
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Clinical Management & Health Analytics Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 ring-1 ring-white/5">
          {/* Quick Fill Demo Credentials Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-between text-xs text-teal-200">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
              <div>
                <p className="font-semibold text-teal-300">Quick Demo Access</p>
                <p className="text-teal-400/80 text-[11px]">admin@doctortracker.com</p>
              </div>
            </div>
            <button
              type="button"
              id="quick-fill-btn"
              onClick={handleQuickFill}
              className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-semibold rounded-lg shadow transition-all duration-150 text-xs flex items-center space-x-1"
            >
              <span>Auto Fill</span>
            </button>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div
              id="login-error-alert"
              className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-sm flex items-start space-x-3 animate-in fade-in duration-200"
            >
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-rose-300">Authentication Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/80">{serverError}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@doctortracker.com"
                  {...register("email")}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-white border rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-rose-500 focus:ring-rose-500/40"
                      : "border-slate-300 focus:border-teal-500 focus:ring-teal-500/30"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center space-x-1">
                  <span>•</span>
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Password
                </label>
              </div>
              <div className="mt-1.5 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`block w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-sm text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-rose-500 focus:ring-rose-500/40"
                      : "border-slate-300 focus:border-teal-500 focus:ring-teal-500/30"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center space-x-1">
                  <span>•</span>
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In to Dashboard</span>
                )}
              </button>
            </div>
          </form>

          {/* Secure System Badge */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-teal-400/70" />
            <span>Encrypted Session • Role-Based Access Control</span>
          </div>
        </div>
      </div>
    </div>
  );
}
