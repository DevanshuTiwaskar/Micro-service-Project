import React from "react";
import { motion } from "framer-motion";
import SidebarContent from "./SidebarContent.jsx";

/**
 * Desktop Sidebar:
 * - hidden on small screens
 * - fixed width, comfortable padding
 */
export default function Sidebar() {
  return (
    <motion.aside
      className="hidden md:flex md:w-64 lg:w-72 flex-col glass p-4 border-r border-white/6 flex-shrink-0"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.28 }}
    >
      <div className="rounded-lg overflow-hidden h-full flex flex-col">
        <div className="px-1">
          {/* optional top branding or small header */}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 py-2">
          <SidebarContent />
        </div>
      </div>
    </motion.aside>
  );
}
