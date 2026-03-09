import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosAuth from "../api/axiosAuth";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosAuth.post("/api/auth/forgot-password", { email: data.email });
      toast.success("OTP sent to your email");
      // Fix: Navigate to /reset as defined in App.jsx
      navigate("/reset", { state: { email: data.email } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
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
            <Mail className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Forgot Password?</h2>
          <p className="text-muted">
            Enter your email and we'll send you an OTP to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 group">
            <label htmlFor="email" className="text-sm font-medium text-muted px-1 group-focus-within:text-primary transition-colors">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                placeholder="yours@example.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-primary/50 transition-all duration-200"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Send OTP</span>
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
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
