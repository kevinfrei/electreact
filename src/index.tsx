import { initializeIcons } from '@fluentui/font-icons-mdl2';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { SetInit } from './MyWindow';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import App from './UI/App';
import './UI/styles/index.css';

SetInit(() => {
  initializeIcons();
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      root,
    );
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
