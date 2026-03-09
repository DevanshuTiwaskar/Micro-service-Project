// src/pages/GoogleCallback.jsx

import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function GoogleCallback() {
  const { fetchAndSetUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Try to fetch the user data using the cookie
      const { ok } = await fetchAndSetUser();

      if (ok) {
        // If successful, redirect to the dashboard
        navigate("/dashboard");
      } else {
        // If it fails (e.g., cookie invalid), send to login
        navigate("/login");      
      }
    };

    handleCallback();
  }, [fetchAndSetUser, navigate]);

  // Show a full-screen loading spinner while this happens
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-white">
      <Loader2 className="animate-spin" size={48} />
      <p className="mt-4 text-muted-foreground">
        Finalizing your login...
      </p>
    </div>
  );
}