import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Google OAuth 2.0 configuration
  const CLIENT_ID = '900734449708-drjrc967e9mav76sd5eg9d8kdjhl6bj2.apps.googleusercontent.com'; // Replace with your actual Client ID
  const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

  useEffect(() => {
    initializeGoogleAuth();
  }, []);

  const initializeGoogleAuth = async () => {
    try {
      // Wait for Google APIs to load
      await new Promise((resolve) => {
        if (window.google && window.gapi) {
          resolve();
        } else {
          const checkLoaded = () => {
            if (window.google && window.gapi) {
              resolve();
            } else {
              setTimeout(checkLoaded, 100);
            }
          };
          checkLoaded();
        }
      });

      // Initialize Google API client
      await window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: '', // Not needed for OAuth flow
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        });
      });

      // Check sessionStorage for existing auth
      const storedUser = sessionStorage.getItem('user');
      const storedToken = sessionStorage.getItem('accessToken');
      
      if (storedUser && storedToken) {
        // Verify token is still valid
        try {
          const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + storedToken);
          if (response.ok) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedToken);
          } else {
            // Token expired, clear storage
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('accessToken');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('accessToken');
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    try {
      // Use Google Identity Services for OAuth 2.0 with PKCE
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response) => {
          if (response.access_token) {
            // Get user info
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                'Authorization': `Bearer ${response.access_token}`,
              },
            });
            
            if (userInfoResponse.ok) {
              const userInfo = await userInfoResponse.json();
              
              const userData = {
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                imageUrl: userInfo.picture,
              };

              setUser(userData);
              setAccessToken(response.access_token);
              
              // Store in sessionStorage
              sessionStorage.setItem('user', JSON.stringify(userData));
              sessionStorage.setItem('accessToken', response.access_token);
            }
          }
        },
        error_callback: (error) => {
          console.error('OAuth error:', error);
          throw new Error('Authentication failed');
        },
      });

      // Request access token
      client.requestAccessToken();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (accessToken) {
        // Revoke the access token
        window.google.accounts.oauth2.revoke(accessToken);
      }
      
      setUser(null);
      setAccessToken(null);
      
      // Clear sessionStorage
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    accessToken,
    isLoading,
    signIn,
    signOut,
    isAuthenticated: !!user && !!accessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};