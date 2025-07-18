import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MusicProvider } from './contexts/MusicContext';
import MainApp from './components/MainApp';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <MainApp />
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;