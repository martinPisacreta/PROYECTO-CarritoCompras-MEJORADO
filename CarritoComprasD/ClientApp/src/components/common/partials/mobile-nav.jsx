import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usuarioService } from '../../../services';
import { mobileMenu } from '../../../utils';
import {rol} from '../../helpers'

function MobileMainNav( props ) {

    const [usuario, setUsuario] = useState({});

    React.useEffect( () => {
        mobileMenu();
    } )

    //voy a buscar los datos del usuario logueado y despues interrumpo el flujo "subscription.unsubscribe();""
    useEffect( () => { 
        const subscription = usuarioService.usuario.subscribe(x => setUsuario(x));
        return subscription.unsubscribe();
        
    }, [] )


    return (
        <nav className="mobile-nav">
            <ul className="mobile-menu">
                <li>
                    <Link to={ `${process.env.PUBLIC_URL}` }>
                        Inicio
                    </Link>
                </li>

                {
                    usuario && 
                    <li>
                        <Link to={ `${process.env.PUBLIC_URL}/usuario/dashboard` }>
                            Mi Cuenta
                        </Link>
                    </li>
                } 

                <li>
                    <Link to={ `${process.env.PUBLIC_URL}/catalogo/list` }>
                        Catalogo
                    </Link>
                </li>

                {
                    usuario && usuario.rol === rol.Admin &&
                    <li>
                        <Link to={ `${process.env.PUBLIC_URL}/usuario/admin_imagenes_articulos` }>
                            Imagenes Articulos
                        </Link>
                    </li>
                } 
            </ul>
        </nav>
    );
}

export default MobileMainNav;