import React from "react";
import { motion } from "framer-motion";
import { Play, MoreHorizontal, Heart, Music2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext.jsx";

export default function SongCard({ song, allSongs }) {
  const { playSong } = usePlayer();

  const handlePlay = (e) => {
    e.stopPropagation();
    playSong(song, allSongs);
  };

  const handleCardClick = () => {
    playSong(song, allSongs);
  };

  return (
    <motion.div
      className="relative group p-4 rounded-[24px] glass border-white/5 cursor-pointer card-depth"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{
        translateY: -8,
        rotateX: 4,
        rotateY: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(46,224,122,0.05)"
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      onClick={handleCardClick}
      viewport={{ once: true }}
    >
      {/* Artwork with Depth */}
      <div className="relative aspect-square mb-5 rounded-2xl overflow-hidden shadow-2xl card-inner">
        <img
          src={song.coverImageUrl}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = `https://placehold.co/150x150/121212/ffffff?text=${song.title.charAt(0)}`;
          }}
        />

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
          <motion.button
            onClick={handlePlay}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play size={24} fill="black" className="ml-1" />
          </motion.button>
        </div>

        {/* Quick Save */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
          <Heart size={16} />
        </button>
      </div>

      {/* Info Section */}
      <div className="space-y-1 px-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-black text-[15px] truncate text-white tracking-tight">{song.title}</h4>
          <div className="p-1 rounded-md bg-white/5 group-hover:bg-accent-primary/20 transition-colors">
            <Music2 size={12} className="text-muted group-hover:text-accent-primary" />
          </div>
        </div>
        <p className="text-[12px] font-bold text-muted truncate uppercase tracking-widest">{song.artist}</p>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
