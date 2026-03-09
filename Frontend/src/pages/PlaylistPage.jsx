import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { musicApi } from "../api/axiosMusic.js";
import { usePlayer } from "../context/PlayerContext.jsx";
import toast from "react-hot-toast";
import { Play, ListMusic, Clock, Music } from "lucide-react";

/**
 * Page: Single Playlist Detail + Play
 */
export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formattedSongs, setFormattedSongs] = useState([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { playlist } = await musicApi.getPlaylistById(id);
        setPlaylist(playlist || null);

        const songs = playlist?.songs || [];
        const formatted = songs.map((song) => ({
          ...song,
          id: song.id || song._id,
          // Normalize for Player: expects 'songUrl'
          songUrl: song.songUrl || song.musicUrl,
        }));
        setFormattedSongs(formatted);
      } catch (err) {
        toast.error("Failed to fetch playlist");
        setPlaylist(null);
        setFormattedSongs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  if (loading) {
    return <PlaylistPageSkeleton />;
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <ListMusic size={48} className="mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">Playlist not found</h2>
      </div>
    );
  }

  return (
    <div>
      <PlaylistHeader playlist={playlist} formattedSongs={formattedSongs} />
      <SongList songs={formattedSongs} />
    </div>
  );
}

/** Header */
function PlaylistHeader({ playlist, formattedSongs }) {
  const { playSong } = usePlayer();
  const coverImage = playlist.songs?.[0]?.coverImageUrl;

  const handlePlayPlaylist = () => {
    if (formattedSongs && formattedSongs.length > 0) {
      playSong(formattedSongs[0], formattedSongs);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 p-6">
      <motion.div
        className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={playlist.name}
            className="w-full h-full object-cover rounded-lg shadow-xl"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/224x224/27272a/71717a?text=${playlist.name?.charAt(0) || "?"}`;
            }}
          />
        ) : (
          <div className="w-full h-full bg-white/10 rounded-lg shadow-xl flex items-center justify-center">
            <Music size={96} className="text-muted-foreground" />
          </div>
        )}
      </motion.div>

      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <span className="text-sm font-semibold text-muted-foreground">Playlist</span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter my-2">
          {playlist.name}
        </h1>
        <p className="text-muted-foreground text-sm">
          {playlist.description || "No description."}
        </p>
        <p className="text-sm mt-2">
          <span className="font-semibold">{playlist.songs?.length || 0} songs</span>
        </p>
        <motion.button
          onClick={handlePlayPlaylist}
          className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center
                       shadow-lg shadow-primary/30 transition-transform hover:scale-105 mt-6"
        >
          <Play size={28} fill="currentColor" className="ml-0.5" />
        </motion.button>
      </div>
    </div>
  );
}

/** Song list */
function SongList({ songs }) {
  return (
    <div className="px-6 pb-6">
      <div className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_1fr_auto] gap-4
                       px-4 py-2 border-b border-white/10 text-sm text-muted-foreground">
        <span className="text-center">#</span>
        <span>Title</span>
        <span className="hidden md:block">Artist</span>
        <span><Clock size={16} /></span>
      </div>

      <div className="mt-2 space-y-1">
        {songs.map((song, index) => (
          <SongRow
            key={song.id || song._id || `${song.title}-${index}`}
            song={song}
            index={index}
            fullPlaylist={songs}
          />
        ))}
      </div>
    </div>
  );
}

/** Single row */
function SongRow({ song, index, fullPlaylist }) {
  const { playSong } = usePlayer();

  const handlePlay = () => {
    playSong(song, fullPlaylist);
  };

  return (
    <div
      className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_1fr_auto] gap-4
                 items-center p-3 rounded-lg cursor-pointer group hover:bg-white/10"
      onClick={handlePlay}
    >
      <span className="text-center text-muted-foreground">{index + 1}</span>
      <div className="flex items-center gap-3">
        <img
          src={song.coverImageUrl}
          alt={song.title}
          className="w-10 h-10 rounded-md object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/40x40/27272a/71717a?text=${(song.title || "?").charAt(0)}`;
          }}
        />
        <div>
          <div className="font-semibold truncate">{song.title}</div>
          <div className="text-sm text-muted-foreground md:hidden truncate">{song.artist}</div>
        </div>
      </div>
      <span className="hidden md:block text-muted-foreground truncate">{song.artist}</span>
      <span className="text-sm text-muted-foreground">3:45</span>
    </div>
  );
}

/** Skeleton */
function PlaylistPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6">
        <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 bg-white/10 rounded-lg"></div>
        <div className="flex flex-col items-center md:items-start">
          <div className="h-4 w-24 bg-white/10 rounded-full"></div>
          <div className="h-16 w-80 bg-white/10 rounded-lg my-2"></div>
          <div className="h-4 w-64 bg-white/10 rounded-full"></div>
          <div className="h-14 w-14 bg-white/10 rounded-full mt-6"></div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="h-10 w-full bg-white/10 rounded-lg"></div>
        <div className="mt-2 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
