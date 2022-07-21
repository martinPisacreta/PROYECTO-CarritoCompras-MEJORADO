import React from 'react';
import { Link } from 'react-router-dom';
import {rol} from '@helpers'
import { usuarioService } from '@services'

export default function MainMenu(  ) {
   

    const usuario = usuarioService.usuarioValue;

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