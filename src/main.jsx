import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './celebration.css';
import './activities.css';
import App from './App.jsx';

// YouTube IFrame Player บล็อก raw IP origin (127.0.0.1) ด้วยรหัส 150 จึงสลับไป localhost ตอนรัน Dev
if (import.meta.env.DEV && window.location.hostname === '127.0.0.1') {
  const nextUrl = window.location.href.replace('127.0.0.1', 'localhost');
  window.location.replace(nextUrl);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
