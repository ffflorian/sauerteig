import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
