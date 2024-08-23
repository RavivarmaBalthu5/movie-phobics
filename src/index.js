// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';
import './index.css'; // Import any global styles

// Create a root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component using the new API
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
