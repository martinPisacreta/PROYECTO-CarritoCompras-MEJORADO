import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/fontawesome-free-brands'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { usuarioActions , empresaActions } from '../../actions';
import { connect } from 'react-redux';

// Common Header Components
import MainMenu from './partials/main-menu';
import CartMenu from './partials/cart-menu';


import { usuarioService } from '../../services';


function Header( props ) {
    const { container = "container" ,  logout , getEmpresaById } = props;
    const [usuario, setUsuario] = useState({});
    const [empresa,setEmpresa] = useState({});

    useEffect(() => {
        getEmpresaById(1).then(x => setEmpresa(x))
    }, []);

    //voy a buscar los datos del usuario logueado y despues interrumpo el flujo "subscription.unsubscribe();""
    useEffect( () => { 
        const subscription = usuarioService.usuario.subscribe(x => setUsuario(x));
        return subscription.unsubscribe();
       
    }, [] )


    function onDelete() {
        logout();
        window.location.href =  `${process.env.PUBLIC_URL}`;
    }



    return (
        <header className="header header-10 header-intro-clearance">
            <div className="header-top">
                <div className={ container }>
                    <div className="header-left">
                        <ul className="top-menu">
                                <li>
                                    <Link to="#">Datos</Link>
                                    <ul>

                                       
                                        <li className="login">
                                            <a className="nav-item nav-link" href="#"><FontAwesomeIcon icon={faPhoneAlt} /> <span> </span> {empresa.telefono}</a>
                                        </li>
                                        <li className="login">
                                            <a href={`https://web.whatsapp.com/send?phone=549${empresa.celular}`} className="nav-item nav-link"><FontAwesomeIcon icon={faWhatsapp} /> <span> </span> {empresa.celular}</a>
                                        </li>
                                        <li className="login">
                                            <a className="nav-item nav-link" href={`mailto:${empresa.email}`}><FontAwesomeIcon icon={faEnvelope} /> <span> </span>{empresa.email}</a>
                                        </li>
                                    </ul>
                                </li>
                        </ul> 
                    </div>

                    <div className="header-right">
                        <ul className="top-menu">
                            <li>
                                <Link to="#">Link</Link>
                                <ul>

                                    {
                                        usuario ?                                        
                                        <li className="login">
                                            <button type="button" onClick={() => onDelete()} className="nav-item nav-link">
                                                <FontAwesomeIcon icon={faSignOutAlt} /> 
                                                <span> </span> 
                                                <span>Cerrar Sesión</span>
                                            </button>
                                        </li>

                                        

                                        : <li className="login">
                                            <div>
                                                    <Link to={ `${process.env.PUBLIC_URL}/usuario/login` } style={{fontWeight: "bold"}}>
                                                        <FontAwesomeIcon icon={faUser} style={{margin:'5px'}} />
                                                        Iniciar Sesión / Registrarse
                                                        
                                                    </Link>

                                                    
                                            </div>   
                                        </li>
                                    }

                                    
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
                              
            </div>

            <div className="header-middle">
                <div className={ container }>
                    <div className="header-left">
                        <button className="mobile-menu-toggler">
                            <span className="sr-only">Toggle mobile menu</span>
                            <i className="icon-bars"></i>
                        </button>

                        <Link to={ `${process.env.PUBLIC_URL}/` } className="logo">
                            <img 
                                src={ `${process.env.PUBLIC_URL}/assets/images/logo.png` + '?' + Date.now() } 
                                alt="Molla Logo" width="105" height="25" />
                        </Link>
                    </div>

                    
                    
                    <div className="header-right">
                        <div className="header-dropdown-link">
                        

                          
                            <CartMenu/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header-bottom sticky-header">
                <div className={ container }>
                  

                    <div className="header-center">
                        <MainMenu />
                    </div>

                </div>
            </div>
          
        </header>

    );
}





const actionCreators = {
    logout: usuarioActions.logout,
    getEmpresaById: empresaActions.getById
};



export default connect(null, actionCreators)(Header);



