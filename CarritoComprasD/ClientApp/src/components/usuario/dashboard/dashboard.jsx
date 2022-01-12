import React from 'react';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';


import { usuarioService} from '@services';


// import Custom Components
import PageHeader from '../../common/page-header';
import Breadcrumb from '../../common/breadcrumb';
import Pedidos from './pedidos';

function Dashboard() {

    const usuario = usuarioService.userValue;


    return (
        <div>
            <Helmet>
                <title>Encendido Alsina | Mi Cuenta</title>
            </Helmet>

            <h1 className="d-none">Encendido Alsina - Mi Cuenta</h1>

            <div className="main">
                <PageHeader  subTitle="Mi Cuenta" />
                <Breadcrumb parent1={ [ "Mi Cuenta", "usuario/dashboard" ] } />

                <div className="page-content">
                    <div className="dashboard">
                        <div className="container">
                            <ul className="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                                <Tabs selectedTabClassName="active show">
                                    <div className="row">
                                        <aside className="col-md-4 col-lg-3">
                                            <TabList>
                                                <Tab className="nav-item">
                                                    <span className="nav-link">Mi Cuenta</span>
                                                </Tab>

                                                <Tab className="nav-item">
                                                    <span className="nav-link">Pedidos</span>
                                                </Tab>

                                                <Tab className="nav-item">
                                                    <span className="nav-link">Descargas</span>
                                                </Tab>

                                                <Tab className="nav-item">
                                                    <span className="nav-link">Dirección de envio</span>
                                                </Tab>

                                                <Tab className="nav-item">
                                                    <Link to={{
                                                            pathname: `${process.env.PUBLIC_URL}/usuario/dashboard_update_user`,
                                                            state: {
                                                                deDondeVengo: 2
                                                            }
                                                        }}>
                                                        <span className="nav-link">Detalle cuenta</span>
                                                    </Link>
                                                </Tab>

                                            </TabList>
                                        </aside>

                                        <div className="col-md-8 col-lg-9" style={ { marginTop: "1rem" } }>
                                            <div className="tab-pane">
                                                <TabPanel>
                                                    <p>Hola <span className="font-weight-normal text-dark">{usuario.razonSocial}</span> <span> </span> 
                                                    {/* <Link to="#">Cerrar Sesión</Link> */}
                                                    <br />
                                                        Desde el panel de su cuenta puede ver sus pedidos, administrar su dirección de envio y facturación, y editar su contraseña y los detalles de su cuenta</p>
                                                </TabPanel>

                                                <TabPanel>
                                                    <Pedidos/>
                                                    {/* <p>Aún no se ha realizado ningún pedido.</p>
                                                    <Link to={ `${process.env.PUBLIC_URL}/catalogo/list` } className="btn btn-outline-primary-2"><span>IR AL CARRITO</span><i className="icon-long-arrow-right"></i></Link> */}
                                                </TabPanel>

                                                <TabPanel>
                                                    <p>Aún no hay descargas disponibles.</p>
                                                    <Link to={ `${process.env.PUBLIC_URL}/catalogo/list` } className="btn btn-outline-primary-2"><span>IR AL CARRITO</span><i className="icon-long-arrow-right"></i></Link>
                                                </TabPanel>

                                                <TabPanel>
                                                    <p>La siguiente información se utilizara en la página de pago de forma predeterminada.</p>

                                                    <div className="row">
                                                        <div className="col-lg-10">
                                                            <div className="card card-dashboard">
                                                                <div className="card-body">
                                                                    <h3 className="card-title">Dirección de envio</h3>

                                                                    <p>{usuario.nombre} {usuario.apellido}<br />
                                                                        {usuario.razonSocial}<br />
                                                                        {usuario.direccion}<br />
                                                                        {usuario.telefono}<br />
                                                                        {usuario.email}<br />
                                                                        <Link to={`${process.env.PUBLIC_URL}/usuario/dashboard_update_user`}>Editar <i className="icon-edit"></i></Link></p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                    </div>
                                                </TabPanel>
                                                <TabPanel>
                                                    {/* agrego este TabPanel vacio , para que no tire error en console de Google Chrome */}
                                                </TabPanel>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </Tabs>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo( Dashboard );