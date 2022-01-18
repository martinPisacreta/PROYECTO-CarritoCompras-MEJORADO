import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../components/app';

import Dashboard from '../components/usuario/dashboard/dashboard';
import InicioSesion  from '../components/usuario/login';
import Register_UpdateUser  from '../components/usuario/register-updateUser';
import Pedidos  from '../components/usuario/dashboard/pedidos';
import VerifyEmail  from '../components/usuario/verify_email';
import ForgotPassword  from '../components/usuario/forgot_password';
import ResetPassword  from '../components/usuario/reset_password';
import AdminImagenArticulos from '../components/usuario/admin_imagenes_articulos';

import { PrivateRouteUser } from './private_route_user';
import { PrivateRouteAdmin } from './private_route_admin';

export default function UsuarioRoute() {
    return (
       
        <Switch>
            <Layout>   
                <Route exact path={ `${process.env.PUBLIC_URL}/usuario/login` } component={ InicioSesion } />
                <Route path={ `${process.env.PUBLIC_URL}/usuario/register`} component={Register_UpdateUser} />
                <Route path={ `${process.env.PUBLIC_URL}/usuario/verify-email`} component={VerifyEmail} />
                <Route path={ `${process.env.PUBLIC_URL}/usuario/forgot-password`} component={ForgotPassword} />
                <Route path={ `${process.env.PUBLIC_URL}/usuario/reset-password`} component={ResetPassword} />
                <PrivateRouteUser exact path={ `${process.env.PUBLIC_URL}/usuario/dashboard` } component={ Dashboard } />
                <PrivateRouteUser exact path={ `${process.env.PUBLIC_URL}/usuario/dashboard/update_user`} component={Register_UpdateUser} />
                <PrivateRouteUser exact path={ `${process.env.PUBLIC_URL}/usuario/dashboard/pedidos`} component={Pedidos} />
                <PrivateRouteAdmin exact path={ `${process.env.PUBLIC_URL}/usuario/admin_imagenes_articulos` } component={ AdminImagenArticulos } />
            </Layout>
        </Switch>
    );
}