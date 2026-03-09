// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axiosAuth from "../api/axiosAuth";
import toast from "react-hot-toast";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // keep minimal user info in localStorage (not tokens)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // for app-level bootstrapping

  // Fetch the user using cookie (backend must validate cookie and return user)
  const fetchAndSetUser = useCallback(async () => {
    try {
      const res = await axiosAuth.get("/api/auth/me"); // backend reads cookie
      const { user: fetchedUser } = res.data || {};
      if (fetchedUser) {
        localStorage.setItem("user", JSON.stringify(fetchedUser));
        setUser(fetchedUser);
        return { ok: true, user: fetchedUser };
      } else {
        localStorage.removeItem("user");
        setUser(null);
        return { ok: false };
      }
    } catch (err) {
      // no valid cookie or server error
      localStorage.removeItem("user");
      setUser(null);
      return { ok: false, err };
    } finally {
      setInitializing(false);
    }
  }, []);

  // run once on mount to hydrate auth state (if a cookie exists)
  useEffect(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]);

  // Login: backend should set httpOnly cookie with token when successful.
  const login = async (email, password) => {
    setLoading(true);
    try {
      // important: axiosAuth has withCredentials true so cookie is returned/set
      const res = await axiosAuth.post("/api/auth/login", { email, password });

      // backend should return user object (non-sensitive) and set httpOnly cookie
      const { user: returnedUser } = res.data || {};
      if (returnedUser) {
        // store *only* safe user fields in localStorage/state (not tokens)
        localStorage.setItem("user", JSON.stringify(returnedUser));
        setUser(returnedUser);
        toast.success("Logged in successfully!");
        return { ok: true, user: returnedUser };
      } else {
        toast.error("Login succeeded but server did not return user.");
        return { ok: false, message: "No user returned" };
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      return { ok: false, err };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await axiosAuth.post("/api/auth/register", payload);
      const { user: returnedUser } = res.data || {};
      if (returnedUser) {
        localStorage.setItem("user", JSON.stringify(returnedUser));
        setUser(returnedUser);
        toast.success("Registered successfully!");
        return { ok: true, data: res.data };
      }
      return { ok: false, message: "No user returned from register" };
    } catch (err) {
      console.error("Register failed. axios error:", err);
      const serverData = err.response?.data;
      const serverErrors = serverData?.errors || serverData?.error || serverData;
      toast.error(serverData?.message || "Registration failed");
      return { ok: false, err, serverErrors, serverData };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // backend should clear cookie
      await axiosAuth.post("/api/auth/logout");
    } catch (e) {
      // still clear client state even if backend logout failed
      console.error("Logout failed (server):", e);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out");
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await axiosAuth.post("/api/auth/forgot-password", { email });
      toast.success("If the email exists, an OTP has been sent.");
      return { ok: true };
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
      return { ok: false, err };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    setLoading(true);
    try {
      await axiosAuth.post("/api/auth/reset-password", { email, otp, newPassword });
      toast.success("Password reset! Please login.");
      return { ok: true };
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password reset failed");
      return { ok: false, err };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = () => {
    // Use relative URL so it works with the unified API Gateway
    window.location.href = `/api/auth/google`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initializing, // indicates initial fetch is in progress
        login,
        logout,
        register,
        forgotPassword,
        resetPassword,
        googleLogin,
        fetchAndSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
