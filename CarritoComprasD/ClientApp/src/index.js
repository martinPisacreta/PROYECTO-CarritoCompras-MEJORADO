import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';

import { history } from './components/helpers';
import { usuarioService } from './services';
import AppRoute from './routes';
import { Provider } from 'react-redux';
import store from './store';



let usuario = JSON.parse(localStorage.getItem('user'));
if(usuario)
    usuarioService.refreshToken().finally(startApp);
else
    startApp();

function startApp() { 
    render(
        <Provider store={store}>
            <Router history={history}>
                <AppRoute />
            </Router>
        </Provider>,
        document.getElementById('root')
    );
}