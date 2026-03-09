import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Music, Play, SkipBack, SkipForward, Sparkles, Zap, Shield } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

export default function Landing() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Ambient Background Depth */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-secondary/5 blur-[120px] rounded-full -z-10" />

      <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 px-8 lg:px-16">
        {/* LEFT: Hero Content */}
        <motion.div
          className="space-y-10 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-accent-primary aura-glow">
            <Sparkles size={14} /> New Era of Streaming
          </motion.div>

          <motion.h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9]" variants={itemVariants}>
            <span className="text-white">Music.</span><br />
            <span className="text-gradient">Redefined.</span>
          </motion.h1>

          <motion.p className="text-xl text-muted max-w-lg font-medium leading-relaxed" variants={itemVariants}>
            Experience your library in an immersive, high-fidelity universe.
            No limits. No distractions. Just pure sound.
          </motion.p>

          <motion.div className="flex flex-wrap gap-5" variants={itemVariants}>
            <Link to="/register" className="btn-aura group flex items-center gap-3">
              Start Listening
              <Zap size={18} className="transition-transform group-hover:scale-125 group-hover:rotate-12" />
            </Link>

            <Link to="/login" className="btn-glass flex items-center gap-2 px-8">
              Sign In
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="flex gap-8 pt-8 border-t border-white/5 opacity-40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Shield size={14} /> Encrypted</div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Music size={14} /> Hi-Res Audio</div>
          </motion.div>
        </motion.div>

        {/* RIGHT: High-Fidelity Mockup Pod */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0, rotate: 5, y: 50 }}
          animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 60 }}
        >
          {/* Glowing Aura Ring */}
          <div className="absolute -inset-10 bg-gradient-to-br from-accent-primary/20 via-accent-secondary/20 to-accent-tertiary/20 blur-[100px] animate-pulse -z-10" />

          <div className="w-full max-w-md glass-heavy rounded-[40px] p-8 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] player-glow backdrop-blur-3xl card-depth">
            <motion.div
              className="relative aspect-square rounded-[32px] overflow-hidden mb-10 shadow-2xl card-inner"
              whileHover={{ scale: 1.02, rotateX: 5, rotateY: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#000]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/20 via-transparent to-accent-secondary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Music size={120} className="text-white/10" />
              </div>
              <img
                src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600"
                alt="Album Art"
                className="w-full h-full object-cover opacity-60"
              />
            </motion.div>

            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-black text-white mb-2">Neon Nights</h3>
                <p className="text-sm font-black text-muted uppercase tracking-[0.3em]">Aura Originals</p>
              </div>

              {/* Progress Simulation */}
              <div className="space-y-3">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full track-gradient"
                    initial={{ width: "0%" }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 2, delay: 1, ease: "circOut" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black text-muted uppercase tracking-tighter">
                  <span>2:45</span>
                  <span>4:12</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center gap-10">
                <SkipBack size={28} className="text-white/40 cursor-default" />
                <motion.div
                  className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl cursor-default"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Play size={36} fill="black" className="ml-1" />
                </motion.div>
                <SkipForward size={28} className="text-white/40 cursor-default" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
