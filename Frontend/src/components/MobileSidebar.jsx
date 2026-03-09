import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useModalStore } from "../store/useModalStore.js";
import SidebarContent from "./SidebarContent.jsx";

export default function MobileSidebar() {
  const isOpen = useModalStore((s) => s.isMobileMenuOpen);
  const close = useModalStore((s) => s.closeMobileMenu);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-[rgba(17,17,19,0.6)] backdrop-blur-md border-r border-white/10 p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <Link  onClick={close} className="text-lg font-bold">
                Aura
              </Link>
              <button
                onClick={close}
                className="p-2 rounded-md text-muted-foreground hover:text-white"
              >
                Close
              </button>
            </div>

            {/* Reuse the same content as the desktop sidebar */}
            <SidebarContent onItemClick={close} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
