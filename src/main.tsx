import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import './styles/modern-theme.css';
// import './styles/premium-ui.css';
import './styles/tech-ui.css'; // Clean, technology-focused UI

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
