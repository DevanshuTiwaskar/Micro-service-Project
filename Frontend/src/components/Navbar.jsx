import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useModalStore } from "../store/useModalStore.js";
import { Waves, LogOut, Settings, ChevronDown, Menu, Search, Bell, User, Music2 } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { clearPlayerState } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const openMobileMenu = useModalStore((s) => s.openMobileMenu);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Playlists", path: "/playlists" },
    { name: "Library", path: "/library" },
  ];

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    clearPlayerState(); // 👈 Fix: Reset player state on logout
    await logout();
    navigate("/login");
  };

  const displayName = user?.fullName?.firstName || user?.username || "User";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <motion.nav
      className="w-full py-3 px-6 glass-heavy sticky top-0 z-50 player-glow border-b border-white/5"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, cubicBezier: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-main flex items-center justify-between gap-8">
        {/* Left: Brand + Search */}
        <div className="flex items-center gap-10 flex-1">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="p-2 rounded-2xl bg-accent-secondary/10 group-hover:bg-accent-secondary/20 transition-all border border-accent-secondary/20"
              whileHover={{ rotate: 12, scale: 1.1 }}
            >
              <Waves size={24} className="text-secondary" style={{ color: "var(--accent-secondary)" }} />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-gradient hidden sm:block italic">AURA</span>
          </Link>

          {/* Navigation Links (Active Indicator) */}
          {user && (
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative text-[13px] font-bold tracking-wide transition-all ${
                      isActive ? "text-accent-secondary" : "text-muted hover:text-white"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-secondary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Premium Search Bar */}
          <div className="hidden md:flex relative flex-1 max-w-xl group">
            <div className="absolute inset-0 bg-accent-primary/20 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent-primary transition-colors z-10" size={16} />
            <input
              type="text"
              placeholder="Explore artists, songs, podcasts..."
              className="relative w-full pl-12 pr-4 py-2.5 rounded-full bg-white/5 border border-white/5 focus:bg-dark-100 focus:border-accent-primary/50 outline-none transition-all text-[13px] font-medium z-10 placeholder:text-muted/50"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center gap-2">
            <button className="p-2.5 rounded-full hover:bg-white/5 text-muted hover:text-white transition-colors">
              <Bell size={18} />
            </button>
            <button className="p-2.5 rounded-full hover:bg-white/5 text-muted hover:text-white transition-colors">
              <Music2 size={18} />
            </button>
          </div>

          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs font-black uppercase tracking-widest text-muted hover:text-white px-2 transition-colors">Sign In</Link>
              <Link to="/register" className="btn-aura text-xs px-8">Get Started</Link>
            </div>
          ) : (
            <div className="relative">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full glass-heavy hover:bg-white/10 transition-all border-white/10 group shadow-lg"
                whileTap={{ scale: 0.96 }}
              >
                <div className="w-8 h-8 rounded-full bg-accent-gradient p-[1.5px]">
                  <div className="w-full h-full rounded-full bg-dark-200 flex items-center justify-center text-[10px] font-black" style={{ background: "var(--bg-dark-200)" }}>
                    {initials}
                  </div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[11px] font-black leading-none">{displayName}</p>
                </div>
                <ChevronDown size={12} className={`text-muted transition-transform duration-500 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-4 w-72 glass-heavy border border-white/5 rounded-[28px] shadow-2xl p-3 z-50 overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9, y: 15, rotateX: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 15, rotateX: -10 }}
                    transition={{ type: "spring", damping: 22, stiffness: 200 }}
                  >
                    <div className="px-5 py-4 bg-white/5 rounded-2xl mb-3 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-xs font-black text-black">
                        {initials}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-black truncate">{displayName}</p>
                        <p className="text-[10px] text-muted truncate uppercase tracking-widest mt-1">Free Tier</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button onClick={() => { navigate("/settings"); setIsDropdownOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 rounded-[18px] text-[13px] font-bold hover:bg-white/5 hover:text-accent-secondary transition-all">
                        <Settings size={16} /> Account Settings
                      </button>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-[18px] text-[13px] font-bold text-red-500/80 hover:bg-red-500/10 transition-all">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button className="md:hidden p-2 text-muted hover:text-white" onClick={openMobileMenu}>
            <Menu size={22} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
