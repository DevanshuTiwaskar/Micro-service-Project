// src/components/ProtectedRoute.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // 1. If NOT logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If role-check is needed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If they are an artist trying to touch user routes (or vice versa),
    // redirect them to THEIR dashboard.
    const dest = user.role === "artist" ? "/artist/dashboard" : "/dashboard";
    return <Navigate to={dest} replace />;
  }

  return children;
}