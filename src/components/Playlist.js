import React from 'react';
import { useMusic } from '../contexts/MusicContext';

const Playlist = () => {
  const {
    playlist,
    currentTrack,
    currentPlaylistIndex,
    play,
    removeFromPlaylist,
    clearPlaylist,
  } = useMusic();

  if (playlist.length === 0) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Playlist
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Add songs to create your playlist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Playlist
          </h3>
          <button
            onClick={clearPlaylist}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            title="Clear playlist"
          >
            Clear All
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {playlist.length} tracks
        </p>
      </div>

      {/* Playlist Items */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {playlist.map((track, index) => (
            <div
              key={`${track.id}-${index}`}
              className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                currentPlaylistIndex === index ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Track Number / Play Button */}
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  {currentPlaylistIndex === index && currentTrack?.id === track.id ? (
                    <div className="flex space-x-1">
                      <div className="w-1 h-3 bg-primary-600 rounded-full animate-pulse"></div>
                      <div className="w-1 h-3 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-3 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    <button
                      onClick={() => play(track)}
                      className="w-6 h-6 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-colors duration-200"
                      title="Play"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {track.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {track.artist}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromPlaylist(track.id)}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  title="Remove from playlist"
                >
                  <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Playlist Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Total tracks:</span>
            <span>{playlist.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Current:</span>
            <span>{currentPlaylistIndex + 1} of {playlist.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;