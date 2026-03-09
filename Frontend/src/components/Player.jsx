import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Maximize2 } from "lucide-react";

export default function Player({ songToPlay, onPlayNext, onPlayPrev }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(songToPlay || null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.78);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (songToPlay && audioRef.current) {
      setCurrentSong(songToPlay);
      audioRef.current.src = songToPlay.songUrl || "";
      if (audioRef.current.src) {
        audioRef.current.play().catch(() => { });
        setIsPlaying(true);
      }
    }
  }, [songToPlay]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const onTimeUpdate = () => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  };
  const onLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration || 0);
  };
  const onSongEnd = () => {
    setIsPlaying(false);
    if (onPlayNext) onPlayNext();
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => { });
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (!progressBarRef.current || !duration || !audioRef.current) return;
    const { left, width } = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(width, e.clientX - left));
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (t) => {
    if (!t || !isFinite(t)) return "0:00";
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onLoadedMetadata={onLoadedMetadata} onEnded={onSongEnd} />

      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed left-0 right-0 bottom-6 z-50 px-4 md:px-8 pointer-events-none"
          >
            <div className="container-main flex justify-center w-full">
              <div className="w-full max-w-5xl glass-heavy rounded-[28px] p-4 border border-white/5 player-glow flex items-center gap-6 pointer-events-auto backdrop-blur-3xl">

                {/* Track Info */}
                <div className="flex items-center gap-4 min-w-[200px] w-1/4">
                  <motion.div
                    className="relative group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={currentSong?.coverImageUrl}
                      alt={currentSong?.title}
                      className="w-14 h-14 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/64x64/121212/ffffff?text=Aura")}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                      <Maximize2 size={16} />
                    </div>
                  </motion.div>
                  <div className="min-w-0 pr-4">
                    <h4 className="font-bold text-sm truncate text-white leading-tight">{currentSong?.title}</h4>
                    <p className="text-[11px] font-medium text-muted truncate mt-1 tracking-wide uppercase">{currentSong?.artist}</p>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex-1 flex flex-col items-center gap-2 max-w-lg">
                  <div className="flex items-center gap-8">
                    <button className="text-muted hover:text-white transition-colors"><Shuffle size={18} /></button>

                    <button onClick={onPlayPrev} className="text-muted hover:text-white transition-all active:scale-90 disabled:opacity-30">
                      <SkipBack size={24} fill="currentColor" />
                    </button>

                    <motion.button
                      onClick={togglePlayPause}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
                    >
                      {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" className="ml-1" />}
                    </motion.button>

                    <button onClick={onPlayNext} className="text-muted hover:text-white transition-all active:scale-90 disabled:opacity-30">
                      <SkipForward size={24} fill="currentColor" />
                    </button>

                    <button className="text-muted hover:text-white transition-colors"><Repeat size={18} /></button>
                  </div>

                  <div className="w-full flex items-center gap-4">
                    <span className="text-[10px] font-mono text-muted w-10 text-right tabular-nums">{formatTime(progress)}</span>
                    <div
                      ref={progressBarRef}
                      onClick={handleSeek}
                      className="h-1.5 flex-1 bg-white/5 rounded-full cursor-pointer relative group overflow-hidden"
                    >
                      <motion.div
                        className="absolute left-0 top-0 h-full rounded-full track-gradient shadow-[0_0_15px_rgba(46,224,122,0.3)]"
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                      />
                      <div className="absolute top-0 bottom-0 bg-white/40 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted w-10 text-left tabular-nums">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Additional Controls */}
                <div className="hidden md:flex items-center justify-end gap-5 w-1/4">
                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-full border border-white/5">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-muted hover:text-white transition-colors pl-1">
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <div className="w-24 group relative">
                      <input
                        type="range" min="0" max="1" step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => { setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  </div>
                  <Maximize2 size={18} className="text-muted hover:text-white cursor-pointer transition-colors" />
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
