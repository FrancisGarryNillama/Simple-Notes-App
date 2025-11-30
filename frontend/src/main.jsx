import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
