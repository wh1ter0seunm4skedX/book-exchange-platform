// Set up the React app with routing
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Force light mode by default
document.documentElement.classList.add('light');
document.documentElement.classList.remove('dark');

// Kick off the app 🥳
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);