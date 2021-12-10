import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../components/app';
// import Login from '../components/pages/others/login';
import ErrorPage from '../components/pages/others/404';





export default function OthersRoute() {
    return (
        <Switch>
            <Layout>
                <Route exact path={ `${process.env.PUBLIC_URL}/pages/404` } component={ ErrorPage } />
            </Layout>
        </Switch>
    );
}