import React from 'react';
import { Link } from 'react-router-dom';
import { mobileMenu } from '@utils';
import {rol} from '@helpers'
import { usuarioService } from '@services'

function MobileMainNav( ) {

    const usuario = usuarioService.usuarioValue;

    React.useEffect( () => {
        mobileMenu();
    } )

   
    return (
        <nav className="mobile-nav">
            <ul className="mobile-menu">
                <li>
                    <Link to={ `${process.env.PUBLIC_URL}` }>
                        Inicio
                    </Link>
                </li>

                

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