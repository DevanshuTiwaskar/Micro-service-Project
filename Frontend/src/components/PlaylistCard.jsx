import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ListMusic } from "lucide-react";

export default function PlaylistCard({ playlist }) {
  const cover = playlist.songs?.[0]?.coverImageUrl;
  const pid = playlist.id || playlist._id;
  const title = playlist.name;
  const subtitle = playlist.songs?.length ? `${playlist.songs.length} Tracks` : "Empty";

  return (
    <Link to={`/playlist/${pid}`} className="block h-full">
      <motion.div
        className="group relative h-full p-4 rounded-[32px] glass border-white/5 cursor-pointer flex flex-col items-center text-center card-depth"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{
          translateY: -10,
          rotateX: 5,
          rotateY: -5,
          boxShadow: "0 25px 50px rgba(0,0,0,0.7), 0 0 30px rgba(75, 111, 245, 0.1)"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        viewport={{ once: true }}
      >
        {/* Play Icon Badge */}
        <div className="absolute top-6 left-6 z-10 p-2 rounded-xl bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <ListMusic size={16} />
        </div>

        {/* Visual Pod */}
        <div className="relative w-full aspect-square rounded-[24px] overflow-hidden mb-6 shadow-2xl card-inner">
          {cover ? (
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              onError={(e) =>
                (e.currentTarget.src = `https://placehold.co/300x300/121212/ffffff?text=${encodeURIComponent(title?.charAt(0) || "?")}`)
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
              <span className="text-4xl font-black text-white/20">{title?.charAt(0)}</span>
            </div>
          )}

          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div
              className="w-16 h-16 rounded-full bg-accent-secondary text-white flex items-center justify-center shadow-[0_0_40px_rgba(75,111,245,0.4)]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play size={28} fill="white" className="ml-1" />
            </motion.div>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-1.5 w-full">
          <h4 className="font-black text-lg truncate px-2 text-white group-hover:text-gradient transition-colors duration-500">{title}</h4>
          <p className="text-[11px] font-black text-muted uppercase tracking-[0.2em]">{subtitle}</p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -inset-1 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 rounded-[34px] blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </motion.div>
    </Link>
  );
}
