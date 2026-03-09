// src/pages/Library.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { musicApi } from "../api/axiosMusic.js";
import { motion } from "framer-motion";
import { Plus, Music2, ServerCrash } from "lucide-react";
import { useModalStore } from "../store/useModalStore.js";
import toast from "react-hot-toast";

/* ======================================================
   CREATE PLAYLIST CARD
   ====================================================== */
const CreatePlaylistCard = () => {
  const openCreatePlaylist = useModalStore((s) => s.openCreatePlaylist);

  return (
    <motion.button
      onClick={openCreatePlaylist}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="
        glass rounded-xl flex flex-col items-center justify-center 
        gap-4 aspect-square border border-dashed border-white/20
        hover:border-white/40 hover:bg-white/5 transition-all
      "
    >
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10">
        <Plus size={32} className="text-white/70" />
      </div>
      <span className="font-semibold text-sm text-muted">New Playlist</span>
    </motion.button>
  );
};

/* ======================================================
   PLAYLIST CARD (futuristic)
   ====================================================== */
const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();
  const pid = playlist._id || playlist.id;
  const cover = playlist.songs?.[0]?.coverImageUrl;

  return (
    <motion.div
      onClick={() => navigate(`/playlist/${pid}`)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="card cursor-pointer p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/10"
    >
      {/* Artwork */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden cover mb-3">
        {cover ? (
          <img
            src={cover}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) =>
              (e.currentTarget.src = `https://placehold.co/300x300/27272a/71717a?text=${playlist.name?.charAt(
                0
              ) || "?"}`)
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/10">
            <Music2 size={42} className="text-muted" />
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="font-semibold truncate">{playlist.name}</h3>
      <p className="text-sm text-muted truncate">
        {playlist.songs?.length || 0} songs
      </p>
    </motion.div>
  );
};

/* ======================================================
   SKELETON CARD
   ====================================================== */
const SkeletonCard = () => (
  <div className="glass p-4 rounded-xl animate-pulse">
    <div className="w-full aspect-square mb-3 bg-white/10 rounded-lg"></div>
    <div className="w-3/4 h-4 bg-white/10 rounded mb-2"></div>
    <div className="w-1/2 h-3 bg-white/10 rounded"></div>
  </div>
);

/* ======================================================
   MAIN LIBRARY PAGE
   ====================================================== */
export default function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Fetch playlists */
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const data = await musicApi.getPlaylists();
        setPlaylists(data.playlists || []);
      } catch (err) {
        console.error(err);
        setError("Couldn't load your playlists.");
        toast.error("Failed to load library");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-6">Your Library</h1>

      {/* GRID */}
      <div className="
        grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
        lg:grid-cols-5 xl:grid-cols-6 gap-6
      ">
        {/* Loading skeleton */}
        {loading &&
          <>
            <CreatePlaylistCard />
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        }

        {/* Error state */}
        {!loading && error && (
          <div className="col-span-full flex flex-col items-center py-20 text-center">
            <ServerCrash size={50} className="text-red-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted">{error}</p>
          </div>
        )}

        {/* Real content */}
        {!loading && !error && (
          <>
            <CreatePlaylistCard />
            {playlists.map((p) => (
              <PlaylistCard key={p._id} playlist={p} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
