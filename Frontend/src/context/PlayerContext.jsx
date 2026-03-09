import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

// 1. Create the Context
const PlayerContext = createContext();

/**
 * Custom hook to use the PlayerContext.
 * Provides easy access to the player state and actions.
 */
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

/**
 * The PlayerProvider component manages the global player state.
 * It holds the current song, the current playlist, and the
 * functions to control playback (play, next, previous).
 */
export const PlayerProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSong, setCurrentSong] = useState(null);

  /**
   * Main function to start playing a song.
   * It receives the song to play and the list it belongs to (the "queue").
   * This is what your <SongCard> will call.
   */
  const playSong = useCallback((song, list) => {

    // --- THIS IS THE FIX ---
    // If 'list' is undefined or not an array,
    // create a new list containing only the single 'song' being played.
    // This prevents the '.map is not a function' error.
    const effectiveList = Array.isArray(list) ? list : [song];
    // -----------------------

    const formattedList = effectiveList.map((s) => ({
      ...s,
      songUrl: s.musicUrl, // Map API key to Player key
    }));

    const formattedSong = {
      ...song,
      songUrl: song.musicUrl,
    };

    const songIndex = formattedList.findIndex((s) => s.id === song.id);

    if (songIndex !== -1) {
      setPlaylist(formattedList);
      setCurrentIndex(songIndex);
      setCurrentSong(formattedSong);
    }
  }, []); // No dependencies needed as it sets all state

  /**
   * Plays the next song in the playlist.
   * Wraps around to the beginning if at the end.
   */
  const playNext = useCallback(() => {
    if (playlist.length === 0) return;

    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
  }, [currentIndex, playlist]);

  /**
   * Plays the previous song in the playlist.
   * Wraps around to the end if at the beginning.
   */
  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(playlist[prevIndex]);
  }, [currentIndex, playlist]);

  /**
   * Resets the player state completely.
   * Useful for layout changes or logout.
   */
  const clearPlayerState = useCallback(() => {
    setPlaylist([]);
    setCurrentIndex(-1);
    setCurrentSong(null);
  }, []);

  // The value provided to all consuming components
  const value = {
    currentSong,
    playSong,
    clearPlayerState,
    playNext,
    playPrev,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

