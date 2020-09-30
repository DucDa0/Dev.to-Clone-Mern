import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import api from './utils/api';
import Navbar from './components/layout/Navbar';
import Routes from './components/routing/Routes';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import { getNotifications } from './actions/notify';
import setAuthToken from './utils/setAuthToken';
import { LOGOUT, CLEAR_PROFILE } from './actions/types';

import './App.css';
import './styles.css';
const App = () => {
  useEffect(() => {
    // set token to localStorage
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    // get notifications if user signed in
    if (api.defaults.headers.common['x-auth-token'] && localStorage.token) {
      store.dispatch(getNotifications());
    }
    store.dispatch(loadUser());

    window.addEventListener('storage', () => {
      // log user out from all tabs if they logged out in one tab or the token expires, or user try to modify token
      if (
        api.defaults.headers.common['x-auth-token'] !== localStorage.token ||
        !localStorage.token
      ) {
        store.dispatch({ type: LOGOUT });
        store.dispatch({ type: CLEAR_PROFILE });
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
