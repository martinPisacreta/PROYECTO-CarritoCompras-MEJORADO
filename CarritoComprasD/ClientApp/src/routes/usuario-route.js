import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../components/app';

import Dashboard from '../components/usuario/dashboard/dashboard';
import Dashboard_Update_User from '../components/usuario/dashboard_update_user';
import InicioSesion  from '../components/usuario/login';
import Register  from '../components/usuario/register';
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
                <Route path={ `${process.env.PUBLIC_URL}/usuario/register`} component={Register} />
                <Route path={ `${process.env.PUBLIC_URL}/usuario/verify-email`} component={VerifyEmail} />
                <Route path={ `${process.env.PUBLIC_URL}/usuario/forgot-password`} component={ForgotPassword} />
                <Route path={ `${process.env.PUBLIC_URL}/usuario/reset-password`} component={ResetPassword} />
                <PrivateRouteUser exact path={ `${process.env.PUBLIC_URL}/usuario/dashboard` } component={ Dashboard } />
                <PrivateRouteUser exact path={ `${process.env.PUBLIC_URL}/usuario/dashboard_update_user`} component={Dashboard_Update_User} />
                <PrivateRouteAdmin exact path={ `${process.env.PUBLIC_URL}/usuario/admin_imagenes_articulos` } component={ AdminImagenArticulos } />
            </Layout>
        </Switch>
    );
}