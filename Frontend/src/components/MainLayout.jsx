import React from "react";
import Sidebar from "./Sidebar.jsx";
import MobileSidebar from "./MobileSidebar.jsx";
import CreatePlaylistModal from "./CreatePlaylistModal.jsx";
import BottomNav from "./BottomNav.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, Crown } from "lucide-react";

export default function MainLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full flex flex-col bg-dark-100 text-white selection:bg-accent-primary/20">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Integrated */}
        <Sidebar />

        {/* Main Content Hub */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Subtle Ambient Background Light */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-secondary/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

          <main className="flex-1 overflow-y-auto no-scrollbar relative z-10" id="main-content">
            <StickyHeader />

            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, cubicBezier: [0.22, 1, 0.36, 1] }}
                className="p-6 md:p-8 pb-32"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <MobileSidebar />
      <BottomNav />
      <CreatePlaylistModal />
    </div>
  );
}

function StickyHeader() {
  const { user } = useAuth();
  const displayName = user?.fullName?.firstName || user?.username;
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between glass-heavy border-b border-white/5 backdrop-blur-2xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-1 glass border-white/5 rounded-full">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => navigate(1)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted hover:text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full glass border-white/10 hover:border-accent-primary/30 transition-all text-sm font-bold group"
        >
          <Crown size={16} className="text-accent-primary group-hover:animate-pulse" />
          Upgrade to Aura Plus
        </motion.button>

        <div className="h-10 w-[1px] bg-white/5 hidden md:block" />

        <div className="flex items-center gap-3 glass border-white/5 p-1 pr-4 rounded-full">
          <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold text-xs ring-1 ring-accent-primary/30">
            {displayName ? displayName.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          <span className="text-sm font-bold tracking-tight hidden lg:block">{displayName}</span>
        </div>
      </div>
    </header>
  );
}
