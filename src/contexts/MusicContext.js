import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlist, setPlaylist] = useState([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      playNext();
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const loadTrack = (track) => {
    if (currentTrack?.id !== track.id) {
      audioRef.current.src = track.downloadUrl;
      setCurrentTrack(track);
      setCurrentTime(0);
    }
  };

  const play = async (track = null) => {
    try {
      if (track) {
        loadTrack(track);
      }
      
      if (audioRef.current.src) {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const playNext = () => {
    if (playlist.length > 0 && currentPlaylistIndex < playlist.length - 1) {
      const nextIndex = currentPlaylistIndex + 1;
      setCurrentPlaylistIndex(nextIndex);
      play(playlist[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (playlist.length > 0 && currentPlaylistIndex > 0) {
      const prevIndex = currentPlaylistIndex - 1;
      setCurrentPlaylistIndex(prevIndex);
      play(playlist[prevIndex]);
    }
  };

  const addToPlaylist = (track) => {
    if (!playlist.find(t => t.id === track.id)) {
      setPlaylist(prev => [...prev, track]);
    }
  };

  const removeFromPlaylist = (trackId) => {
    setPlaylist(prev => prev.filter(t => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
      pause();
    }
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentPlaylistIndex(-1);
    setCurrentTrack(null);
    pause();
  };

  const playPlaylist = (tracks, startIndex = 0) => {
    setPlaylist(tracks);
    setCurrentPlaylistIndex(startIndex);
    play(tracks[startIndex]);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const value = {
    musicFiles,
    setMusicFiles,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    playlist,
    currentPlaylistIndex,
    isLoading,
    play,
    pause,
    togglePlay,
    seek,
    playNext,
    playPrevious,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    playPlaylist,
    formatTime,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};