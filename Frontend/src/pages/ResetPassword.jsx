import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosAuth from "../api/axiosAuth";
import toast from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { KeyRound, Mail, Lock, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Pre-fill email if passed from ForgotPassword stage
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: location.state?.email || ""
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosAuth.post("/api/auth/reset-password", data);
      toast.success("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md glass p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-soft border-soft mb-4">
            <KeyRound className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Reset Password</h2>
          <p className="text-muted">
            Enter the OTP sent to your email and choose a new password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1 group">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 transition-all"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* OTP */}
          <div className="space-y-1 group">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider ml-1">One-Time Password (OTP)</label>
            <div className="relative">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                {...register("otp", { required: "OTP is required" })}
                placeholder="6-digit code"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 transition-all font-mono tracking-[0.5em] text-center text-lg"
              />
            </div>
            {errors.otp && <p className="text-red-400 text-xs mt-1">{errors.otp.message}</p>}
          </div>

          {/* New Password */}
          <div className="space-y-1 group">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 transition-all"
              />
            </div>
            {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50 transition-all mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
