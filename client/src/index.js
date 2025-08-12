import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router } from 'react-router-dom';
import setAuthToken from './utils/setauthtoken';
import { loadUser } from './action/signupauth';

// Set token if exists
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// Load user before rendering app
store.dispatch(loadUser());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);
