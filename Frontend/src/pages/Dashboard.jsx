// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { musicApi } from "../api/axiosMusic.js";
import SongCard from "../components/SongCard";
import toast from "react-hot-toast";
import { Music, ServerCrash } from "lucide-react";

// --- Skeleton Components ---

/**
 * 1. Skeleton for the main "Song Card" grid.
 * (This is the one you already have, just defined here for clarity)
 */
const SongCardSkeleton = () => (
  <div className="glass p-3 rounded-xl flex flex-col animate-pulse">
    <div className="w-full aspect-square mb-3 rounded-lg bg-white/10"></div>
    <div className="w-3/4 h-4 bg-white/10 rounded mb-1.5"></div>
    <div className="w-1/2 h-3 bg-white/10 rounded"></div>
  </div>
);

/**
 * 2. NEW Skeleton for a larger "Featured" item.
 * This shows a different shape, making the UI feel more structured.
 */
const FeaturedCardSkeleton = () => (
  <div className="glass p-4 rounded-xl flex items-center gap-4 animate-pulse">
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-white/10 flex-shrink-0"></div>
    <div className="flex-1 space-y-3">
      <div className="w-1/2 h-5 bg-white/10 rounded"></div>
      <div className="w-full h-3 bg-white/10 rounded"></div>
      <div className="w-3/4 h-3 bg-white/10 rounded"></div>
    </div>
  </div>
);

/**
 * 3. NEW Skeleton for a Section Header (e.g., "Discover")
 */
const HeaderSkeleton = ({ widthClass = "w-1/3" }) => (
  <div
    className={`h-8 bg-white/10 rounded-lg animate-pulse mb-6 ${widthClass}`}
  ></div>
);

// --- Main Dashboard Component ---

export default function Dashboard() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await musicApi.getAllMusic();
        
        // Use the correct key from your API (we fixed this before)
        setSongs(data.musics || []); 

      } catch (err)
      {
        setError("Could not load music. Please try again later.");
        toast.error("Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // --- ⭐ RENDER: LOADING STATE (THE NEW DESIGN) ---
  if (loading) {
    return (
      <motion.div
        className="p-4 md:p-8 space-y-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Section 1: Featured Items */}
        <div>
          <HeaderSkeleton widthClass="w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeaturedCardSkeleton />
            <FeaturedCardSkeleton />
            <FeaturedCardSkeleton />
          </div>
        </div>

        {/* Section 2: Discover Grid */}
        <div>
          <HeaderSkeleton widthClass="w-1/3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SongCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // --- RENDER: ERROR STATE ---
  if (error) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center py-20">
        <ServerCrash size={48} className="mx-auto text-red-400" />
        <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  // --- RENDER: EMPTY STATE ---
  if (songs.length === 0) {
    return (
      <div className="p-4 md:p-8 flex flex-col items-center justify-center text-center py-20">
        <Music size={48} className="mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">No music found</h2>
        <p className="text-muted-foreground">
          Upload some music to get started!
        </p>
      </div>
    );
  }

  // --- RENDER: SUCCESS STATE (Full Page) ---
  // (This part is just an example of how you'd structure the real page)
  return (
    <motion.div 
      className="p-4 md:p-8 space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Real Section 1: Featured (You would fetch this data) */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Featured Playlists</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Map over your featured playlists here */}
        </div>
      </div>

      {/* Real Section 2: Discover */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Discover</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {songs.map((song) => (
            <SongCard
              key={song.id || song._id}
              song={song}
              allSongs={songs}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}