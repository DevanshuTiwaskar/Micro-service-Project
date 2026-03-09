import { create } from "zustand";

export const useModalStore = create((set) => ({
  // Create Playlist modal
  isCreatePlaylistOpen: false,
  openCreatePlaylist: () => set({ isCreatePlaylistOpen: true }),
  closeCreatePlaylist: () => set({ isCreatePlaylistOpen: false }),

  // Mobile menu (sidebar drawer)
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Other (kept for future)
  // Add other modal states here as needed
}));
