import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext.jsx';
import { Toaster } from 'react-hot-toast'; // For auth notifications
import './index.css'; // Your main Tailwind stylesheet
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      {/* Provide the AuthContext to the entire app.
        Now, useAuth() will work everywhere.
      */}
      <AuthProvider>
        {/* Provide the PlayerContext to the entire app.
          Now, usePlayer() will work everywhere.
        */}
        <PlayerProvider>

          <App />
          {/* This renders the toast notifications from your AuthContext */}
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
);
