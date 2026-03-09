// src/pages/Login.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Waves, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Input = ({ label, name, register, rules = {}, error, icon, type = "text", ...rest }) => (
  <div className="space-y-1.5 w-full">
    <label htmlFor={name} className="text-sm font-medium text-muted">
      {label}
    </label>
    <div className="flex items-center gap-3 glass border border-white/20 rounded-lg px-3 py-3 focus-within:ring-2 focus-within:ring-primary">
      {icon}
      <input
        id={name}
        type={type}
        {...register(name, rules)}
        className="w-full py-2 bg-transparent outline-none"
        {...rest}
      />
    </div>
    {error && <p className="text-sm text-red-400 mt-1.5">{error.message}</p>}
  </div>
);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function Login() {
  const { login, loading, googleLogin, fetchAndSetUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // inside Login.jsx
  const onSubmit = async (data) => {
    const resp = await login(data.email, data.password);
    if (!resp?.ok) return; // login() already shows toast on failure

    // ensure cookie-based session is read and user is set
    const who = await fetchAndSetUser();

    // who.ok true -> fetchAndSetUser returned user in context
    const role = who?.user?.role || (who.ok ? (user && user.role) : null);

    // Redirect logic: if artist -> artist dashboard, otherwise normal 'from'
    if (role === "artist") {
      navigate("/artist/dashboard", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };


  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md glass p-8 rounded-xl border border-white/10 shadow-xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <Waves className="mx-auto text-muted" size={40} />
          <h2 className="text-3xl font-bold mt-4">Welcome back to Aura</h2>
          <p className="text-muted mt-2">Sign in to access your music.</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <motion.div variants={itemVariants}>
            <Input
              label="Email"
              name="email"
              type="email"
              register={register}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address",
                },
              }}
              error={errors.email}
              icon={<Mail size={18} className="text-muted" />}
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label="Password"
              name="password"
              type="password"
              register={register}
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              }}
              error={errors.password}
              icon={<Lock size={18} className="text-muted" />}
              disabled={loading}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="text-right text-sm">
            <Link to="/forgot" className="text-muted font-medium transition-all hover:underline">
              Forgot Password?
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="w-full btn-aura py-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </motion.button>
          </motion.div>
        </form>

        <motion.div variants={itemVariants} className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-muted bg-transparent">OR</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.button
            onClick={googleLogin}
            className="w-full bg-white/10 border border-white/20 py-3 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors hover:bg-white/20"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.045 0-9.36-3.108-11.423-7.461l-6.571 4.819C9.656 39.663 16.318 44 24 44z"></path>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.099 34.61 44 28.134 44 20c0-1.341-.138-2.65-.389-3.917z"></path>
            </svg>
            Sign in with Google
          </motion.button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-sm text-muted mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-muted font-medium transition-all hover:underline">
            Sign Up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
