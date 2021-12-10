import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../components/app';
import Catalogo from '../components/pages/catalogo';



export default function CatalogoRoute() {
    return (
        <Switch>
            <Layout>
                	<Route exact path={ `${process.env.PUBLIC_URL}/catalogo/:grid` } component={ Catalogo } />
            </Layout>
        </Switch>
    );
}