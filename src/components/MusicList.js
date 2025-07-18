import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import googleDriveService from '../services/googleDriveService';

const MusicList = () => {
  const { accessToken } = useAuth();
  const {
    musicFiles,
    setMusicFiles,
    currentTrack,
    play,
    addToPlaylist,
    playPlaylist,
  } = useMusic();

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken) {
      loadMusicFiles();
    }
  }, [accessToken]);

  const loadMusicFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const files = await googleDriveService.getMusicFiles(accessToken);
      setMusicFiles(files);
    } catch (error) {
      console.error('Error loading music files:', error);
      setError('Failed to load music files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      loadMusicFiles();
      return;
    }

    setIsLoading(true);
    try {
      const files = await googleDriveService.searchMusicFiles(term, accessToken);
      setMusicFiles(files);
    } catch (error) {
      console.error('Error searching music files:', error);
      setError('Failed to search music files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sortedFiles = [...musicFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'size':
        return b.size - a.size;
      case 'date':
        return new Date(b.modifiedTime) - new Date(a.modifiedTime);
      default:
        return 0;
    }
  });

  const filteredFiles = sortedFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayAll = () => {
    if (filteredFiles.length > 0) {
      playPlaylist(filteredFiles, 0);
    }
  };

  if (isLoading && musicFiles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 mx-auto mb-4">
            <svg className="w-full h-full text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading your music files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Music Library
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {musicFiles.length} tracks found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search music..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input pl-10 w-full sm:w-64"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="name">Sort by Name</option>
              <option value="artist">Sort by Artist</option>
              <option value="size">Sort by Size</option>
              <option value="date">Sort by Date</option>
            </select>

            {/* Refresh */}
            <button
              onClick={loadMusicFiles}
              disabled={isLoading}
              className="btn-secondary"
              title="Refresh"
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Play All Button */}
        {filteredFiles.length > 0 && (
          <div className="mt-4">
            <button
              onClick={handlePlayAll}
              className="btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play All ({filteredFiles.length})
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 m-6 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Music List */}
      <div className="flex-1 overflow-auto">
        {filteredFiles.length === 0 && !isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No music files found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Upload some music files to your Google Drive to get started.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="btn-secondary"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFiles.map((file, index) => (
              <div
                key={file.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  currentTrack?.id === file.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Play Button */}
                    <button
                      onClick={() => play(file)}
                      className="p-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200"
                      title="Play"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.title}
                        </h4>
                        {currentTrack?.id === file.id && (
                          <div className="flex space-x-1">
                            <div className="w-1 h-3 bg-primary-600 rounded-full animate-pulse"></div>
                            <div className="w-1 h-3 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-3 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {file.artist}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {googleDriveService.formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => addToPlaylist(file)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                      title="Add to playlist"
                    >
                      <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" />
                        <path d="M17 6a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L17 10.586V6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicList;