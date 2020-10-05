import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { HashRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import api from './api';

const interval = setInterval(() => {
  if (api.ws.connectionEstablished()) {
    clearInterval(interval);
    ReactDOM.render(
      <HashRouter>
        <App />
      </HashRouter>,
      document.getElementById('root'),
    );
  }
}, 100);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
