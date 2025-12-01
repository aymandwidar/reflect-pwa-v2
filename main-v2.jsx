import React from 'react';
import ReactDOM from 'react-dom/client';
import AppV2 from './App-v2.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AppV2 />);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}
