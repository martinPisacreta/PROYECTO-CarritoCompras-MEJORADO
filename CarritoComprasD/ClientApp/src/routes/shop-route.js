import React from 'react';
import {  Switch } from 'react-router-dom';

import Layout from '../components/app';
import Cart from '../components/pages/shop/cart';
import { PrivateRouteUser } from './private_route_user';


export default function ShopRoute() {
    return (
        <Switch>
            <Layout>
                <PrivateRouteUser exact path={ `${process.env.PUBLIC_URL}/shop/cart` } component={ Cart } />
            
            </Layout>
        </Switch>
    );
}