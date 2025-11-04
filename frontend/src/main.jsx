import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Service Worker will be registered automatically by vite-plugin-pwa

// Request notification permission on user interaction
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

// Wait for user interaction before requesting permission
document.addEventListener('click', requestNotificationPermission, { once: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
