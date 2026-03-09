// src/components/GuestRoute.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * GuestRoute
 * Prevents logged-in users from accessing public pages (Landing, Login, Register).
 * Redirects them to their appropriate dashboard.
 */
export default function GuestRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-white">
                <Loader2 className="animate-spin" size={48} />
            </div>
        );
    }

    if (user) {
        // Redirect based on role
        const dest = user.role === "artist" ? "/artist/dashboard" : "/dashboard";
        return <Navigate to={dest} replace />;
    }

    return children;
}
