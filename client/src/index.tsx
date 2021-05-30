import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '~/index.css';
import App from '~/App';
import { store } from './store/store';
import reportWebVitals from '~/reportWebVitals';

const app = (
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

ReactDOM.render(app, document.getElementById('app'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
