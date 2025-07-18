class GoogleDriveService {
  constructor() {
    this.SUPPORTED_FORMATS = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'];
  }

  async getMusicFiles(accessToken) {
    try {
      const query = this.buildMusicQuery();
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,size,mimeType,parents,createdTime,modifiedTime)&pageSize=1000`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.processMusicFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching music files:', error);
      throw error;
    }
  }

  buildMusicQuery() {
    const mimeTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/flac',
      'audio/mp4',
      'audio/aac',
      'audio/x-wav',
      'audio/x-flac'
    ];
    
    const mimeQuery = mimeTypes.map(type => `mimeType='${type}'`).join(' or ');
    const extensionQuery = this.SUPPORTED_FORMATS.map(ext => `name contains '.${ext}'`).join(' or ');
    
    return `(${mimeQuery} or ${extensionQuery}) and trashed=false`;
  }

  processMusicFiles(files) {
    return files
      .filter(file => this.isMusicFile(file))
      .map(file => ({
        id: file.id,
        name: this.cleanFileName(file.name),
        originalName: file.name,
        size: file.size ? parseInt(file.size) : 0,
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        downloadUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        artist: this.extractArtist(file.name),
        title: this.extractTitle(file.name),
        duration: null, // Will be set when audio loads
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  isMusicFile(file) {
    if (!file.name) return false;
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isSupportedExtension = this.SUPPORTED_FORMATS.includes(extension);
    const isSupportedMimeType = file.mimeType?.startsWith('audio/');
    
    return isSupportedExtension || isSupportedMimeType;
  }

  cleanFileName(fileName) {
    return fileName.replace(/\.[^/.]+$/, ''); // Remove extension
  }

  extractArtist(fileName) {
    // Try to extract artist from common patterns like "Artist - Title.mp3"
    const patterns = [
      /^(.+?)\s*-\s*.+$/,  // "Artist - Title"
      /^(.+?)\s*–\s*.+$/,  // "Artist – Title" (em dash)
      /^(.+?)\s*_\s*.+$/,  // "Artist _ Title"
    ];

    for (const pattern of patterns) {
      const match = fileName.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return 'Unknown Artist';
  }

  extractTitle(fileName) {
    // Remove extension first
    const nameWithoutExt = this.cleanFileName(fileName);
    
    // Try to extract title from common patterns
    const patterns = [
      /^.+?\s*-\s*(.+)$/,  // "Artist - Title"
      /^.+?\s*–\s*(.+)$/,  // "Artist – Title" (em dash)
      /^.+?\s*_\s*(.+)$/,  // "Artist _ Title"
    ];

    for (const pattern of patterns) {
      const match = nameWithoutExt.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return nameWithoutExt;
  }

  async getFileMetadata(fileId, accessToken) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,size,mimeType,parents,createdTime,modifiedTime`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching file metadata:', error);
      throw error;
    }
  }

  async downloadFile(fileId, accessToken) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async searchMusicFiles(query, accessToken) {
    try {
      const searchQuery = `name contains '${query}' and (${this.buildMusicQuery()})`;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}&fields=files(id,name,size,mimeType,parents,createdTime,modifiedTime)&pageSize=100`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.processMusicFiles(data.files || []);
    } catch (error) {
      console.error('Error searching music files:', error);
      throw error;
    }
  }
}

export default new GoogleDriveService();