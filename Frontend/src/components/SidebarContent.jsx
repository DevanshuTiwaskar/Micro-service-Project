import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Library, Plus, Music2, Heart, Download } from "lucide-react";
import { motion } from "framer-motion";
import { musicApi } from "../api/axiosMusic.js";
import { useModalStore } from "../store/useModalStore.js";

const NavItem = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
        ? "bg-white/10 text-white aura-glow shadow-[0_0_20px_rgba(46,224,122,0.05)]"
        : "text-muted hover:text-white hover:bg-white/5"
      }`
    }
  >
    <div className="transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
      {icon}
    </div>
    <span className="tracking-tight">{children}</span>
  </NavLink>
);

const PlaylistLink = ({ playlist, onClick }) => {
  const pid = playlist.id || playlist._id;
  const cover = playlist.songs?.[0]?.coverImageUrl;

  return (
    <NavLink
      to={`/playlist/${pid}`}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group
         ${isActive ? "bg-white/5 text-white shadow-inner" : "text-muted hover:text-white hover:bg-white/4"}`
      }
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors shadow-lg">
        {cover ? (
          <img
            src={cover}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/60x60/121212/ffffff?text=?")
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted">
            <Music2 size={18} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-[13px] truncate leading-tight">{playlist.name}</div>
        <div className="text-[11px] text-muted truncate mt-0.5 tracking-wide uppercase font-semibold">Playlist • {playlist.createdBy?.fullName?.firstName || "Aura User"}</div>
      </div>
    </NavLink>
  );
};

export default function SidebarContent({ onItemClick }) {
  const openCreatePlaylist = useModalStore((s) => s.openCreatePlaylist);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await musicApi.getPlaylists();
        if (!mounted) return;
        setPlaylists(data.playlists || []);
      } catch (err) {
        console.error("Failed to load playlists:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Top Nav Group */}
      <div className="px-2 space-y-1">
        <NavItem to="/dashboard" icon={<Home size={20} className="text-accent-primary" />} onClick={onItemClick}>
          Home
        </NavItem>
        <NavItem to="/search" icon={<Search size={20} />} onClick={onItemClick}>
          Explore
        </NavItem>
        <NavItem to="/library" icon={<Library size={20} />} onClick={onItemClick}>
          Library
        </NavItem>
      </div>

      {/* Action Divider */}
      <div className="my-6 mx-4 h-[1px] bg-white/5" />

      {/* Collections Section */}
      <div className="px-2 space-y-1 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4 px-4">
          <h3 className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">Playlists</h3>
          <motion.button
            onClick={() => {
              openCreatePlaylist();
              if (onItemClick) onItemClick();
            }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg glass border-white/5 text-muted hover:text-accent-primary transition-all"
          >
            <Plus size={16} />
          </motion.button>
        </div>

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-1 no-scrollbar pb-10">
          <div className="space-y-1 mb-6 px-1">
            <NavItem to="/collection/liked" icon={<Heart size={18} className="text-red-400 fill-red-400/10" />} onClick={onItemClick}>
              Liked Songs
            </NavItem>
            <NavItem to="/artist/dashboard" icon={<Music2 size={18} className="text-accent-secondary" />} onClick={onItemClick}>
              Artist Lab
            </NavItem>
          </div>

          <div className="space-y-1 px-1">
            {loading ? (
              <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-10 h-10 bg-white/5 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-2 w-24 bg-white/5 rounded"></div>
                  <div className="h-2 w-16 bg-white/5 rounded"></div>
                </div>
              </div>
            ) : playlists.length > 0 ? (
              playlists.map((p) => (
                <PlaylistLink key={p.id || p._id} playlist={p} onClick={onItemClick} />
              ))
            ) : (
              <div className="text-[11px] text-muted text-center py-8 px-4 bg-white/2 rounded-2xl border border-dashed border-white/5">
                No custom playlists yet.<br />Create one above.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / App Links */}
      <div className="p-4 mt-auto">
        <div className="glass p-4 rounded-2xl space-y-3">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Aura Desktop</p>
          <button className="w-full py-2.5 rounded-xl bg-white text-black text-xs font-black flex items-center justify-center gap-2 hover:bg-accent-primary transition-colors">
            <Download size={14} /> Install App
          </button>
        </div>
      </div>
    </div>
  );
}
