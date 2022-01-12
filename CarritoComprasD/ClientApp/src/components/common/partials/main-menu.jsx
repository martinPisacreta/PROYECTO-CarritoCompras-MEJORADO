import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {rol} from '@helpers'

export default function MainMenu(  ) {
    const [ path, setPath ] = useState( "" );
   
    const usuario = JSON.parse(localStorage.getItem('user'));

    useEffect( () => {
        setPath( window.location.href );
    } )

  
    

    return (

        
        <nav className="main-nav">
        <ul className="menu sf-arrows">
            <li className={ `megamenu-container` } id="menu-home">
                <Link  to={ `${process.env.PUBLIC_URL}` } className="sf-with">Inicio</Link>
            </li>

           


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