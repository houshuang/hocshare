import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import sharedb from 'sharedb/lib/client';
import './index.css';

// Expose a singleton WebSocket connection to ShareDB server
const socket = new WebSocket('ws://localhost:5000');
export const connection = new sharedb.Connection(socket);
window.connection = connection;

ReactDOM.render(<App welcome="hi" />, document.getElementById('root'));
registerServiceWorker();
