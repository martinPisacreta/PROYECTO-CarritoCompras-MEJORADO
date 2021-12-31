import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';
import ReactDOM from 'react-dom';
import { history } from './components/helpers';

import AppRoute from './routes';
import { Provider } from 'react-redux';
import store from './store';
import { usuarioService } from './services';


const usuario = JSON.parse(localStorage.getItem('user'));


//cuando el usuario esta logueado queda activo un temporizador 
//que vence un minuto antes de que expire el token .Cuando vence el temporizador 
//se llama a la funcion usuarioService.refreshToken() de forma silenciosa o en segundo plano.
usuario ? usuarioService.refreshToken().finally(startApp)
        : startApp();

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

