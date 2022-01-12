import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import LoadingOverlay from '../components/features/loading-overlay';
import { PrivateRouteUser } from './private_route_user';
import { scrollTop } from '@utils';
import {Alert} from '../components/alert'

const ShopPages = React.lazy( () => import( './shop-route.js' ) );
const OtherPages = React.lazy( () => import( './others-route.js' ) );
const HomePage = React.lazy( () => import( './home-route.js' ) );
const UsuarioPage = React.lazy( () => import( './usuario-route.js' ) );
const CatalogoPage = React.lazy( () => import( './catalogo-route.js' ) );

function AppRoot() {
    useEffect( () => {
        scrollTop();
    
    }, [] )

    return (
        <React.Suspense fallback={ <LoadingOverlay /> }>
            <Alert />
            <Switch>
                <PrivateRouteUser  path={ `${process.env.PUBLIC_URL}/shop` } component={ ShopPages } />
                <Route path={ `${process.env.PUBLIC_URL}/catalogo` } component={ CatalogoPage } />
                <Route path={ `${process.env.PUBLIC_URL}/usuario` } component={ UsuarioPage } />
                <Route path={ `${process.env.PUBLIC_URL}/pages` } component={ OtherPages } />
                <Route path={ `${process.env.PUBLIC_URL}/` } component={ HomePage } />
                
            </Switch>
        </React.Suspense>
    )
}



export default AppRoot;


