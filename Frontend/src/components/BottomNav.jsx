import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Library, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
    return (
        <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass-heavy border border-white/5 rounded-full px-6 py-3 flex items-center justify-between z-40 player-glow shadow-2xl backdrop-blur-3xl"
        >
            <NavItem to="/dashboard" icon={<Home size={22} />} label="Home" />
            <NavItem to="/search" icon={<Search size={22} />} label="Search" />
            <NavItem to="/dashboard" icon={<Compass size={22} />} label="Discover" />
            <NavItem to="/library" icon={<Library size={22} />} label="Library" />
        </motion.nav>
    );
}

function NavItem({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? "text-accent-primary aura-glow scale-110" : "text-muted hover:text-white"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    {icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
                    {isActive && (
                        <motion.div
                            layoutId="bottom-nav-dot"
                            className="w-1 h-1 rounded-full bg-accent-primary mt-0.5"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}
