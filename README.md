# MusicDrive WebPlayer

A modern web-based music player that streams your music collection directly from Google Drive. Built with React and Tailwind CSS, featuring Google OAuth 2.0 authentication and a responsive design with dark mode support.

## 🎵 Features

- **Google Drive Integration**: Stream music files (MP3, WAV, OGG, FLAC, M4A, AAC) directly from your Google Drive
- **Google OAuth 2.0**: Secure authentication using PKCE flow without server requirements
- **Modern Music Player**: Full-featured player with play/pause, volume control, progress bar, and track navigation
- **Playlist Management**: Create and manage custom playlists
- **Search & Sort**: Find your music quickly with search and sorting options
- **Responsive Design**: Fully responsive design that works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Updates**: Automatic refresh of your music library
- **No Server Required**: Completely client-side application

## 🚀 Live Demo

[View Live Demo](https://your-app-name.onrender.com)

## 📋 Prerequisites

Before you begin, ensure you have:

- A Google account with music files stored in Google Drive
- Node.js (version 14 or higher)
- A Google Cloud Console project with Drive API enabled

## 🛠️ Setup Instructions

### 1. Google Cloud Console Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Drive API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Drive API" and enable it

3. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type
   - Add your domain to "Authorized JavaScript origins":
     - For development: `http://localhost:3000`
     - For production: `https://your-app-name.onrender.com`
   - Add your domain to "Authorized redirect URIs":
     - For development: `http://localhost:3000`
     - For production: `https://your-app-name.onrender.com`
   - Copy the Client ID for the next step

4. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Fill in the required information
   - Add your email to test users (for development)
   - Add the following scopes:
     - `https://www.googleapis.com/auth/drive.readonly`

### 2. Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/musicdrive-webplayer.git
   cd musicdrive-webplayer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Google OAuth**:
   - Open `src/contexts/AuthContext.js`
   - Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID:
   ```javascript
   const CLIENT_ID = 'your-actual-client-id.apps.googleusercontent.com';
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - Sign in with your Google account
   - Grant permissions to access your Google Drive files

### 3. Deployment on Render

1. **Prepare for deployment**:
   - Ensure your Google OAuth credentials include your Render domain
   - Update the Client ID in the code if different for production

2. **Deploy to Render**:
   - Connect your GitHub repository to Render
   - Create a new "Static Site" service
   - Set the build command: `npm run build`
   - Set the publish directory: `build`
   - Deploy the application

3. **Update Google OAuth settings**:
   - Add your Render domain to the authorized origins and redirect URIs
   - Update the Client ID in your deployed code if necessary

## 🎯 Usage

1. **Sign In**: Click "Sign in with Google" and authorize the application
2. **Browse Music**: Your music files from Google Drive will automatically load
3. **Play Music**: Click the play button on any track to start playing
4. **Create Playlists**: Add tracks to your playlist using the playlist button
5. **Control Playback**: Use the player controls at the bottom of the screen
6. **Search & Sort**: Use the search bar and sort options to find specific tracks
7. **Dark Mode**: Toggle between light and dark themes using the theme button

## 🔧 Configuration

### Supported Audio Formats

- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)
- FLAC (.flac)
- M4A (.m4a)
- AAC (.aac)

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🏗️ Project Structure

```
musicdrive-webplayer/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── LoginScreen.js
│   │   ├── MainApp.js
│   │   ├── MusicList.js
│   │   ├── MusicPlayer.js
│   │   └── Playlist.js
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   ├── MusicContext.js
│   │   └── ThemeContext.js
│   ├── services/
│   │   └── googleDriveService.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔒 Security & Privacy

- **No Server Storage**: All data remains in your Google Drive
- **Secure Authentication**: Uses Google OAuth 2.0 with PKCE flow
- **Session Storage**: Access tokens are stored in browser session storage
- **Read-Only Access**: The app only requests read permissions for your Drive files
- **No Data Collection**: No user data is collected or stored by the application

## 🐛 Troubleshooting

### Common Issues

1. **"Sign in failed" error**:
   - Check that your Google Client ID is correct
   - Ensure your domain is added to authorized origins
   - Verify that Google Drive API is enabled

2. **No music files found**:
   - Ensure you have music files in your Google Drive
   - Check that the files are in supported formats
   - Try refreshing the music library

3. **Playback issues**:
   - Check your internet connection
   - Ensure the browser supports the audio format
   - Try a different browser

### Debug Mode

To enable debug logging, open browser developer tools and check the console for detailed error messages.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Google Drive API](https://developers.google.com/drive) - File storage and streaming
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) - Authentication

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing [GitHub Issues](https://github.com/yourusername/musicdrive-webplayer/issues)
3. Create a new issue if your problem isn't already reported

---

**Note**: This application requires a Google account and music files stored in Google Drive. The app only requests read-only access to your Drive files and does not modify or delete any content.