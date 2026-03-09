import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { musicApi } from "../api/axiosMusic.js";
import PlaylistCard from "../components/PlaylistCard.jsx";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

/**
 * "Your Library" -> Playlists page.
 */
export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const data = await musicApi.getPlaylists();
        setPlaylists(data.playlists || []);
      } catch (err) {
        toast.error("Failed to fetch playlists");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  return (
    <div className="p-4 md:p-8">
      {loading ? <PlaylistGridSkeleton /> : <PlaylistGrid playlists={playlists} />}
    </div>
  );
}

function PlaylistGrid({ playlists }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <CreatePlaylistCard />
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id || playlist._id}
              playlist={playlist}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function CreatePlaylistCard() {
  return (
    <Link to="/create-playlist">
      <motion.div
        className="relative glass p-3 rounded-xl flex flex-col items-center justify-center
                   cursor-pointer overflow-hidden group aspect-square"
        whileHover={{ scale: 1.05, translateY: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="w-full h-full border-2 border-dashed border-white/20 rounded-lg
                        flex flex-col items-center justify-center text-muted-foreground
                        transition-colors group-hover:border-primary group-hover:text-primary">
          <Plus size={48} />
          <span className="font-semibold mt-2">Create Playlist</span>
        </div>
      </motion.div>
    </Link>
  );
}

function PlaylistGridSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <div className="h-8 w-64 bg-white/10 rounded-lg mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="glass p-3 rounded-xl flex flex-col items-center animate-pulse"
            >
              <div className="w-full aspect-square mb-3 rounded-lg bg-white/10"></div>
              <div className="w-3/4 h-4 bg-white/10 rounded mb-1.5"></div>
              <div className="w-1/2 h-3 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
