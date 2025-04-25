import React from 'react';
import ReactDOM from 'react-dom/client';
// Update the import path for the CSS file
import App from './App';

// Create a config object if config.js is not available
try {
  require('./config');
} catch (e) {
  window.CONFIG = { GOOGLE_MAPS_API_KEY: '' };
  console.warn('No config.js found. Using default empty API key.');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
