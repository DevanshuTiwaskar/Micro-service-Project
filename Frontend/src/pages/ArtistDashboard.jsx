import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar.jsx"; // adjust path if named default export
import Navbar from "../components/Navbar";
import Player from "../components/Player";
import SongCard from "../components/SongCard";
import axiosMusic from "../api/axiosMusic";
import { useForm } from "react-hook-form";
import { Plus, Upload, Trash2, Edit, X, Music2, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";




export default function ArtistDashboard() {
  const { user, token } = useAuth(); // assumes AuthContext exposes user and token
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploadOpen, setUploadOpen] = useState(false);

  // react-hook-form for file upload
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  useEffect(() => {
    fetchArtistData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchArtistData() {
    setLoading(true);
    setError(null);
    try {
      // Corrected: Fetch tracks specific to this artist via query param
      const tracksRes = await axiosMusic.get(`/api/music/get?artistId=${user.id}`);

      // Adapt to response shape
      setTracks(tracksRes?.data?.musics || []);

      // Use user context for basic artist info since no specific /artist/me exists
      setArtist({
        name: user?.fullName?.firstName + " " + user?.fullName?.lastName || user?.username,
        avatarUrl: null,
        bio: "Independent Artist",
        followers: 0,
        plays: 0
      });
    } catch (e) {
      console.error("fetchArtistData error:", e);
      setError("Could not load artist data.");
    } finally {
      setLoading(false);
    }
  }

  async function onUploadSubmit(formData) {
    setUploading(true);
    setError(null);

    try {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("genre", formData.genre || "Unknown");
      if (formData.artwork && formData.artwork[0]) body.append("coverImage", formData.artwork[0]); // Correct key
      if (formData.audio && formData.audio[0]) body.append("music", formData.audio[0]); // Correct key

      // Correct endpoint: /create
      const res = await axiosMusic.post("/api/music/create", body, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res?.data) {
        const newTrack = res.data.music || res.data;
        setTracks(prev => [newTrack, ...prev]);
        reset();
        setUploadOpen(false);
        toast.success("Track uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (e) {
      console.error("Upload error:", e);
      setError("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  }

  async function onDeleteTrack(trackId) {
    // Currently no delete route in music service — placeholder for future
    toast.error("Delete functionality not yet implemented on server.");
  }

  // small helper to render statistic tiles
  const Stat = ({ label, value }) => (
    <div className="glass p-4 rounded-lg flex flex-col items-start gap-1">
      <div className="text-2xl font-bold">{value ?? "—"}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-900)] text-white">
      <div className="flex">
        {/* <Sidebar /> */}

        <div className="flex-1">
          {/* <Navbar /> */}

          <main className="p-6 md:p-10">
            <div className="flex flex-col gap-6">
              {/* ARTIST HEADER */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="relative">
                  <div
                    className="h-44 md:h-56 w-full bg-gradient-to-r from-purple-700 to-blue-600 flex items-end"
                    style={{
                      backgroundImage: artist?.coverUrl ? `url(${artist.coverUrl})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-6 md:p-8 flex items-center gap-6">
                    <div
                      className="w-28 h-28 rounded-xl overflow-hidden border border-white/10"
                      style={{
                        backgroundImage: artist?.avatarUrl ? `url(${artist.avatarUrl})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold">{artist?.name || user?.username || "Your Artist Name"}</h1>
                      <p className="text-sm text-muted mt-1">{artist?.bio || "Tell fans about yourself."}</p>

                      <div className="mt-6 flex flex-wrap gap-4">
                        <button onClick={() => setUploadOpen(true)} className="btn-aura flex items-center gap-3">
                          <Plus size={18} /> Upload New Track
                        </button>
                        <button className="btn-glass flex items-center gap-2 px-6">
                          <Edit size={16} /> Edit Profile
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:flex gap-3">
                      <Stat label="Followers" value={artist?.followers || 0} />
                      <Stat label="Tracks" value={tracks.length} />
                      <Stat label="Total Plays" value={artist?.plays || 0} />
                    </div>
                  </div>
                </div>
              </div>

              {/* STATS row for mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:hidden">
                <Stat label="Followers" value={artist?.followers || 0} />
                <Stat label="Tracks" value={tracks.length} />
                <Stat label="Total Plays" value={artist?.plays || 0} />
              </div>

              {/* TRACKS LIST */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Tracks</h2>
                  <div className="text-sm text-muted">{tracks.length} tracks</div>
                </div>

                {loading ? (
                  <div className="glass p-6 rounded-lg">Loading...</div>
                ) : error ? (
                  <div className="glass p-6 rounded-lg text-red-400">{error}</div>
                ) : tracks.length === 0 ? (
                  <div className="glass p-6 rounded-lg">
                    No tracks yet — upload your first song.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tracks.map((t) => {
                      // adapt id & image fields depending on your data shape
                      const id = t.id || t._id || t.trackId;
                      const artwork = t.artworkUrl || t.cover || t.image;
                      const title = t.title || t.name || "Untitled";
                      const artistName = t.artistName || artist?.name || user?.username;

                      // if you already have SongCard component, prefer using it:
                      // <SongCard key={id} track={t} />
                      return (
                        <div key={id} className="glass p-4 rounded-lg flex flex-col">
                          <div className="relative">
                            <div className="h-40 w-full rounded-md overflow-hidden" style={{ backgroundImage: artwork ? `url(${artwork})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
                          </div>

                          <div className="mt-3 flex-1">
                            <h3 className="font-semibold">{title}</h3>
                            <p className="text-xs text-muted mt-1">{artistName}</p>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="text-xs text-muted">{t.duration ? `${t.duration}` : ""}</div>
                              <div className="flex gap-2">
                                <button title="Edit" className="btn-ghost p-2 rounded" onClick={() => alert("Edit track - implement UI")}>
                                  <Edit size={16} />
                                </button>
                                <button title="Delete" className="btn-ghost p-2 rounded" onClick={() => onDeleteTrack(id)}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* <Player /> */}
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {isUploadOpen && (
        <Modal onClose={() => setUploadOpen(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl glass p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Upload New Track</h3>
              <button onClick={() => setUploadOpen(false)} className="btn-ghost p-2 rounded">
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit(onUploadSubmit)} className="mt-4 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted">Title</label>
                  <input {...register("title", { required: true })} className="w-full glass px-3 py-2 rounded-md bg-transparent outline-none" placeholder="Song title" />
                  {errors.title && <div className="text-xs text-red-400 mt-1">Required</div>}
                </div>

                <div>
                  <label className="text-sm text-muted">Album</label>
                  <input {...register("album")} className="w-full glass px-3 py-2 rounded-md bg-transparent outline-none" placeholder="Album (optional)" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted">Genre</label>
                  <input {...register("genre")} className="w-full glass px-3 py-2 rounded-md bg-transparent outline-none" placeholder="Genre" />
                </div>

                <div>
                  <label className="text-sm text-muted">Explicit</label>
                  <div className="mt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register("explicit")} className="h-4 w-4" />
                      <span className="text-sm text-muted">Explicit lyrics</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted">Artwork (image)</label>
                  <input type="file" accept="image/*" {...register("artwork")} />
                </div>

                <div>
                  <label className="text-sm text-muted">Audio file</label>
                  <input type="file" accept="audio/*" {...register("audio", { required: true })} />
                  {errors.audio && <div className="text-xs text-red-400 mt-1">Audio file required</div>}
                </div>
              </div>

              <div className="flex items-center gap-4 justify-end mt-6">
                <button type="button" onClick={() => setUploadOpen(false)} className="px-6 py-2.5 text-sm font-bold text-muted hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="btn-aura px-8 py-2.5 flex items-center gap-3" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      <span>Release Track</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </Modal>
      )}
    </div>
  );
}

/* Simple Modal component used by the page — minimal, self-contained */
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-3xl">{children}</div>
    </div>
  );
}
