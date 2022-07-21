import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/fontawesome-free-brands'

import {   empresaActions } from '@actions';
import { usuarioService } from '@services'

import { connect } from 'react-redux';


import MainMenu from '../partials/main-menu';
import CartMenu from '../partials/cart-menu';

import {
    Box,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton
} from '@mui/material';

import {
    Logout as LogoutIcon,
    Login as LoginIcon,
    AccountCircle as AccountCircleIcon,
    Home as HomeIcon
} from '@mui/icons-material';


import { green } from '@mui/material/colors';
import './header.css'


function Header( props ) {
    const { container = "container"  , getEmpresaById } = props;
    const [empresa,setEmpresa] = useState({});
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const usuario = usuarioService.usuarioValue;
    
    useEffect(() => {
        async function funcionAsync() {
            await getEmpresaById(1)
            .then(x => {
                setEmpresa(x)
            })
            .catch(error => {
                console.log(error)
            });
        }
        funcionAsync();

    }, []);

  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };


 
    function onDelete() {
        usuarioService.logout();
    }

    
 
    return (
        <header className="header header-10 header-intro-clearance">
            <div className="header-top">
                <div className={ container } >
                    <div className="header-left">
                        <ul className="top-menu">
                                <li>
                                    <Link to="#">Datos</Link>
                                    <ul>

                                       
                                        <li className="login">
                                            <a className="nav-item nav-link" href="#"><FontAwesomeIcon icon={faPhoneAlt} /> <span> </span> {empresa && empresa.telefono}</a>
                                        </li>
                                        <li className="login">
                                            <a href={empresa ? `https://web.whatsapp.com/send?phone=549${empresa.celular}` : '#'} className="nav-item nav-link"><FontAwesomeIcon icon={faWhatsapp} /> <span> </span> {empresa && empresa.celular}</a>
                                        </li>
                                        <li className="login">
                                            <a className="nav-item nav-link" href={empresa ? `mailto:${empresa.email}` : "#"}><FontAwesomeIcon icon={faEnvelope} /> <span> </span>{empresa && empresa.email}</a>
                                        </li>
                                    </ul>
                                </li>
                        </ul> 
                    </div>

                    <div className="header-right">
                        <ul className="top-menu-custom">
                            <li>
                               
                                 <ul>

                                    
                                        <div>
                                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                            <IconButton
                                                onClick={handleClick}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={open ? 'account-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                            >
                                               <Avatar sx={{ bgcolor: green[500] , width: 30, height: 30 }}>
                                                    <HomeIcon fontSize="large" />
                                                </Avatar>
                                            </IconButton>
                                        </Box>
                                        <Menu
                                        anchorEl={anchorEl}
                                        id="account-menu"
                                        open={open}
                                        onClose={handleClose}
                                        onClick={handleClose}
                                        PaperProps={{
                                          elevation: 0,
                                          sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                              width: 32,
                                              height: 32,
                                              ml: -0.5,
                                              mr: 1,
                                            },
                                            '&:before': {
                                              content: '""',
                                              display: 'block',
                                              position: 'absolute',
                                              top: 0,
                                              right: 14,
                                              width: 10,
                                              height: 10,
                                              bgcolor: 'background.paper',
                                              transform: 'translateY(-50%) rotate(45deg)',
                                              zIndex: 0,
                                            },
                                            '&.MuiMenuItem-root': {
                                                fontSize: '1.4rem'
                                              },
                                          },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                      >
                                          {
                                                usuario ? 
                                                <div>
                                                    <MenuItem
                                                         component={Link}
                                                         to={ `${process.env.PUBLIC_URL}/usuario/dashboard`}
                                                    >
                                                        <ListItemIcon>
                                                            <AccountCircleIcon fontSize="large" />
                                                        </ListItemIcon>
                                                        <span style={{fontSize: '1.4rem'}}>Mi Cuenta</span>
                                                    </MenuItem>
                                                    <Divider />
                                                    <MenuItem
                                                        onClick={() => onDelete()}
                                                    >
                                                        <ListItemIcon>
                                                            <LogoutIcon fontSize="large" />
                                                        </ListItemIcon>
                                                        <span style={{fontSize: '1.4rem'}}>Cerrar Sesión</span>
                                                    </MenuItem>
                                                </div>
                                                     :
                                                <div>

                                                    <MenuItem
                                                        component={Link}
                                                        to={ `${process.env.PUBLIC_URL}/usuario/login` }
                                                    >
                                                        <ListItemIcon>
                                                            <LoginIcon fontSize="large" />
                                                        </ListItemIcon>
                                                        <span style={{fontSize: '1.4rem'}}>Iniciar Sesión / Registrarse</span>
                                                    </MenuItem>

                                                 
                                                   
                                                </div>

                                          }
                                          </Menu>
                                      </div>
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
    getEmpresaById: empresaActions.getById
};




export default connect(null, actionCreators)(Header);



