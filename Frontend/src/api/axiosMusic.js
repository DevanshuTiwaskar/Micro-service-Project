import axios from "axios";

// ✅ Base URL (from .env or default)
const baseURL = import.meta.env.VITE_MUSIC_BASE_URL || "";

// ✅ Create the Axios instance
const axiosMusic = axios.create({
  baseURL,
  withCredentials: true,
});

// ✅ Unified Error Handler
const handleError = (error, defaultMessage) => {
  const errMsg = error?.response?.data?.message || error.message || defaultMessage;
  console.error(`[Music API] ${errMsg}`);
  throw new Error(errMsg);
};

// Small helpers to normalize ids
const withId = (obj) => (obj ? { id: obj.id || obj._id, ...obj } : obj);
const mapWithId = (arr = []) => arr.map((p) => withId(p));

export const musicApi = {
  /**
   * 🎵 Upload a new music track
   * @param {FormData} formData - Must include title, music file, and coverImage file
   */
  createMusic: async (formData) => {
    try {
      const { data } = await axiosMusic.post("/api/music/create", formData);
      // normalize
      return {
        ...data,
        music: withId(data.music),
      };
    } catch (error) {
      handleError(error, "Failed to upload music");
    }
  },

  /**
   * 🎶 Fetch all available songs (optionally filter by artistId)
   */
  getAllMusic: async (artistId) => {
    try {
      const params = artistId ? { artistId } : {};
      const { data } = await axiosMusic.get("/api/music/get", { params });
      return {
        ...data,
        musics: mapWithId(data.musics),
      };
    } catch (error) {
      handleError(error, "Failed to fetch music");
    }
  },

  /**
   * 🎧 Create a new playlist
   * @param {object} playlistData - { name, description, songs }
   */
  createPlaylist: async (playlistData) => {
    try {
      const { data } = await axiosMusic.post("/api/music/playlist/create", playlistData);
      return {
        ...data,
        playlist: withId(data.playlist),
      };
    } catch (error) {
      handleError(error, "Failed to create playlist");
    }
  },

  /**
   * 📜 Fetch all playlists
   */
  getPlaylists: async () => {
    try {
      const { data } = await axiosMusic.get("/api/music/playlist/get");
      return {
        ...data,
        playlists: mapWithId(data.playlists || []),
      };
    } catch (error) {
      handleError(error, "Failed to fetch playlists");
    }
  },

  /**
   * 📄 Fetch a single playlist by ID
   */
  getPlaylistById: async (playlistId) => {
    try {
      const { data } = await axiosMusic.get("/api/music/playlist/get", {
        params: { playlistId },
      });
      // Some backends return {playlist}, some return {playlists:[one]}
      const playlist =
        withId(data.playlist) ||
        (Array.isArray(data.playlists) && withId(data.playlists[0])) ||
        null;

      return { message: data.message, playlist };
    } catch (error) {
      handleError(error, "Failed to fetch playlist");
    }
  },
};

export default axiosMusic;
