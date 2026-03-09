// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePlayer } from "./context/PlayerContext.jsx";

// Page Imports
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PlaylistPage from "./pages/PlaylistPage.jsx";
import Playlists from "./pages/Playlists.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import Library from "./pages/Library.jsx";

// New Artist page import
import ArtistDashboard from "./pages/ArtistDashboard.jsx";

// Component Imports
import Navbar from "./components/Navbar.jsx";
import Player from "./components/Player.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

/**
 * ProtectedLayout
 * A small wrapper that composes ProtectedRoute + MainLayout + Outlet so we can
 * define protected child routes just once.
 */
function ProtectedLayout({ allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  const { currentSong, playNext, playPrev } = usePlayer();
  const location = useLocation();

  useEffect(() => {
    const routeTitles = {
      "/": "AURA | Experience Music",
      "/login": "Sign In | AURA",
      "/register": "Get Started | AURA",
      "/dashboard": "Dashboard | AURA",
      "/playlists": "My Playlists | AURA",
      "/library": "Music Library | AURA",
      "/settings": "Account Settings | AURA",
    };

    const currentTitle = routeTitles[location.pathname] || "AURA";
    document.title = currentTitle;
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes - Wrapped in GuestRoute to redirect if already logged in */}
          <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset" element={<GuestRoute><ResetPassword /></GuestRoute>} />
          <Route path="/google-callback" element={<GoogleCallback />} />

          {/* Protected routes grouped under ProtectedLayout */}
          <Route element={<ProtectedLayout />}>
            {/* Standard User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            <Route path="/library" element={<Library />} />
          </Route>

          {/* Artist Only Routes */}
          <Route element={<ProtectedLayout allowedRoles={["artist"]} />}>
            <Route path="/artist/dashboard" element={<ArtistDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Persistent Player */}
      {currentSong && (
        <Player songToPlay={currentSong} onPlayNext={playNext} onPlayPrev={playPrev} />
      )}
    </div>
  );
}
