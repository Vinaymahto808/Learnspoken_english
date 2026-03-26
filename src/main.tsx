import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App, { StandaloneAuthPage } from './App.tsx';
import './index.css';

const isAuthPage = new URLSearchParams(window.location.search).get('auth') === '1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAuthPage ? <StandaloneAuthPage /> : <App />}
  </StrictMode>,
);
