import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usuarioService } from '../../../services';
import {rol} from '../../helpers'

export default function MainMenu( props ) {
    const [ path, setPath ] = useState( "" );
    const [usuario, setUsuario] = useState({});


    useEffect( () => {
        setPath( window.location.href );
    } )

    //voy a buscar los datos del usuario logueado y despues interrumpo el flujo "subscription.unsubscribe();""
    useEffect( () => { 
        const subscription = usuarioService.usuario.subscribe(x => setUsuario(x));
        return subscription.unsubscribe();
        
    }, [] )


    

    return (

        
        <nav className="main-nav">
        <ul className="menu sf-arrows">
            <li className={ `megamenu-container` } id="menu-home">
                <Link  to={ `${process.env.PUBLIC_URL}` } className="sf-with">Inicio</Link>
            </li>

            {
                usuario && 
                <li className={ `megamenu-container` } id="menu-home">
                    <Link to={ `${process.env.PUBLIC_URL}/usuario/dashboard` } className="sf-with">Mi Cuenta</Link>
                </li>
            } 


            <li className={ `megamenu-container` } id="menu-home">
                <Link  to={ `${process.env.PUBLIC_URL}/catalogo/list` } className="sf-with">Catalogo</Link>
            </li>

            {
                usuario && usuario.rol === rol.Admin &&
                <li className={ `megamenu-container` } id="menu-home">
                    <Link to={ `${process.env.PUBLIC_URL}/usuario/admin_imagenes_articulos` } className="sf-with">Imagenes Articulos</Link>
                </li>
            } 
        </ul>
    </nav>
    );
}