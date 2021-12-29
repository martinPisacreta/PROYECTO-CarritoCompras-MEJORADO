import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { history } from './components/helpers';

import AppRoute from './routes';
import { Provider } from 'react-redux';
import store from './store';



ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <AppRoute />
        </Router>
    </Provider>,
    document.getElementById('root')
  );
  