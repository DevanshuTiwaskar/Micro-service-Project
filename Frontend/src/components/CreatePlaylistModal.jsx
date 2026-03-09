import React from "react";
import { musicApi } from "../api/axiosMusic.js";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useModalStore } from "../store/useModalStore.js";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: { opacity: 0, y: 20, scale: 0.98 },
};

export default function CreatePlaylistModal() {
  const isOpen = useModalStore((s) => s.isCreatePlaylistOpen);
  const close = useModalStore((s) => s.closeCreatePlaylist);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const playlistData = {
        name: data.name,
        description: data.description,
        songs: data.songs
          ? data.songs
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      await musicApi.createPlaylist(playlistData);

      toast.success("Playlist created successfully!");
      reset();
      close();
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Failed to create playlist.";
      toast.error(message);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
          ></div>

          {/* Modal container */}
          <motion.div
            className="relative z-10 w-full max-w-md sm:mx-auto
                       rounded-t-xl sm:rounded-xl border border-white/10 bg-[rgba(17,17,19,0.6)] p-4 sm:p-6"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ minHeight: 0 }}
          >
            {/* Close button */}
            <div className="flex items-start justify-end">
              <button
                onClick={close}
                className="p-2 rounded-md text-muted-foreground hover:bg-white/5"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-3">Create New Playlist</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <input
                  {...register("name", { required: "Playlist name is required" })}
                  placeholder="Playlist name"
                  className="w-full p-3 rounded-lg bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("description")}
                  placeholder="Description (optional)"
                  className="w-full p-3 rounded-lg bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <input
                  {...register("songs")}
                  placeholder="Song IDs (e.g., id1, id2, id3)"
                  className="w-full p-3 rounded-lg bg-transparent border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary px-4 py-3 rounded-lg text-black font-semibold transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Creating..." : "Create Playlist"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    close();
                  }}
                  className="hidden sm:inline-block px-4 py-3 rounded-lg border border-white/10 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
