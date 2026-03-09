// src/pages/Register.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Waves, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

/* Google icon (same SVG as previously used) */
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.045 0-9.36-3.108-11.423-7.461l-6.571 4.819C9.656 39.663 16.318 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.099 34.61 44 28.134 44 20c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);

/* Input component */
const Input = ({ label, name, register, rules = {}, error, icon, type = "text", placeholder }) => (
  <div className="space-y-1.5 w-full">
    <label htmlFor={name} className="text-sm font-medium text-muted">
      {label}
    </label>
    <div className="flex items-center gap-3 glass border border-white/20 rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary">
      {icon}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className="w-full py-3 bg-transparent outline-none"
        autoComplete="off"
      />
    </div>
    {error && <p className="text-sm text-red-400">{error.message}</p>}
  </div>
);

/* Checkbox component */
const Checkbox = ({ register, name, label, description }) => {
  const id = name;
  return (
    <div className="flex items-start gap-3.5">
      <div className="relative mt-0.5">
        <input
          id={id}
          type="checkbox"
          {...register(name)}
          className={`
            peer h-5 w-5 cursor-pointer appearance-none
            rounded-md border border-white/30 bg-transparent
            transition-all
            focus:outline-none focus:ring-2 focus:ring-primary/50
            checked:bg-[var(--primary)] checked:border-[var(--primary)]
          `}
        />
        <Check
          className={`
            absolute top-0.5 left-0.5 h-4 w-4
            text-black pointer-events-none
            opacity-0 peer-checked:opacity-100 transition-opacity
          `}
          aria-hidden
        />
      </div>

      <div className="grid gap-0.5 select-none">
        <label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-muted">{description}</p>
      </div>
    </div>
  );
};

export default function Register() {
  const { register: registerUser, loading, googleLogin } = useAuth();
  const { fetchAndSetUser } = useAuth();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { isArtist: false },
  });

  // Map server validation errors into react-hook-form
  const handleServerErrors = (serverResponse) => {
    if (!serverResponse) return false;

    if (Array.isArray(serverResponse.errors)) {
      serverResponse.errors.forEach((e) => {
        const field = e.param || e.field || e.path;
        const message = e.msg || e.message || "Invalid";
        if (field) setError(field, { type: "server", message });
      });
      return true;
    }

    if (serverResponse.errors && typeof serverResponse.errors === "object" && !Array.isArray(serverResponse.errors)) {
      Object.entries(serverResponse.errors).forEach(([field, message]) => {
        setError(field, { type: "server", message: String(message) });
      });
      return true;
    }

    if (serverResponse.field && serverResponse.message) {
      setError(serverResponse.field, { type: "server", message: serverResponse.message });
      return true;
    }

    if (typeof serverResponse === "object") {
      let applied = false;
      Object.entries(serverResponse).forEach(([k, v]) => {
        if (["email", "username", "password", "firstName", "lastName", "fullName"].includes(k)) {
          setError(k, { type: "server", message: String(v) });
          applied = true;
        }
      });
      if (applied) return true;
    }

    return false;
  };

  const onSubmit = async (data) => {
    const payload = {
      username: data.username?.trim(),
      email: data.email?.trim().toLowerCase(),
      password: data.password,
      fullName: { firstName: data.firstName?.trim(), lastName: data.lastName?.trim() },
      ...(data.isArtist ? { role: "artist" } : {}),
    };

    const res = await registerUser(payload);
    if (!res || !res.ok) {
      // existing error handling...
      return;
    }

    // After register, the backend sets the cookie and returns user.
    // Fetch and set the user via cookie (safest)
    const who = await fetchAndSetUser();

    const role = who?.user?.role || res?.data?.user?.role || (data.isArtist ? "artist" : "user");

    if (role === "artist") {
      navigate("/artist/dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };


  return (
    <motion.div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-lg glass p-8 rounded-xl border border-white/10 shadow-xl">
        <div className="text-center mb-8">
          <Waves className="mx-auto text-muted" size={40} />
          <h2 className="text-3xl font-bold mt-4">Create your Aura account</h2>
          <p className="text-muted mt-2">Start listening to your music, anywhere.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              label="First Name"
              name="firstName"
              register={register}
              rules={{ required: "First name is required" }}
              error={errors.firstName}
              icon={<User size={18} className="text-muted" />}
              placeholder="John"
            />
            <Input
              label="Last Name"
              name="lastName"
              register={register}
              rules={{ required: "Last name is required" }}
              error={errors.lastName}
              icon={<User size={18} className="text-muted" />}
              placeholder="Doe"
            />
          </div>

          <Input
            label="Username"
            name="username"
            register={register}
            rules={{ required: "Username is required", minLength: { value: 3, message: "Min 3 characters" } }}
            error={errors.username}
            icon={<User size={18} className="text-muted" />}
            placeholder="john_doe"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            rules={{
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
            }}
            error={errors.email}
            icon={<Mail size={18} className="text-muted" />}
            placeholder="john@example.com"
          />

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
            placeholder="••••••••"
          />

          <Checkbox
            name="isArtist"
            register={register}
            label="I am an Artist"
            description="Select this to upload your own music."
          />

          <motion.button
            type="submit"
            className="w-full btn-aura py-3 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-muted bg-transparent">OR</span>
          </div>
        </div>

        <motion.button
          onClick={googleLogin}
          className="w-full bg-white/10 border border-white/20 py-3 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors hover:bg-white/20"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <GoogleIcon />
          Sign up with Google
        </motion.button>

        <p className="text-center text-sm text-muted mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-muted font-medium transition-all hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
