import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { usuarioService } from '@services'


// El componente PrivateRoute representa un componente de ruta si el usuario ha iniciado sesión  y tiene un rol autorizado para la ruta,
// si el usuario no ha iniciado sesión, se le redirige a la /login página, 
// si el usuario ha iniciado sesión pero no rol autorizado son redirigidos a la página de inicio.




function PrivateRouteUser({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => {
            const usuario = usuarioService.usuarioValue;
            // si el usuario no esta logueado...
            if (!usuario) {
                // not logged in so redirect to login page with the return url
                
                return <Redirect to={{ pathname: `${process.env.PUBLIC_URL}/usuario/login`, state: { from: props.location } }} />
            }

    
            
            // authorized so return component
            return <Component {...props} />
        }} />
    );
}

export { PrivateRouteUser };