import React from 'react';
import { Helmet } from 'react-helmet';
import PageHeader from '../../common/page-header';
import Breadcrumb from '../../common/breadcrumb';
import SubirImagenes from './subir_imagenes'

import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';


export default function AdminImagenesArticulos ()  {

   
    return (
        <>
            <Helmet>
                <title>Encendido Alsina - Administrador Imagenes Articulos</title>
            </Helmet>
            
            <h1 className="d-none">Encendido Alsina - Administrador Imagenes Articulos</h1>
            
            <div className="main">
                <PageHeader  subTitle="Administrador Imagenes Articulos" />
                <Breadcrumb  parent1={  [ "Imagenes Articulos", "usuario/admin_imagenes_articulos" ] } />

                <div className="page-content">
                        <div className="dashboard">
                            <div className="container">
                                <ul className="nav nav-dashboard flex-column mb-3 mb-md-0" role="tablist">
                                    <Tabs selectedTabClassName="active show">
                                        <div className="row">
                                            <aside className="col-md-4 col-lg-3">
                                                <TabList>
                                                    <Tab className="nav-item">
                                                        <span className="nav-link">Asignar Imagenes a Articulos</span>
                                                    </Tab>

                                                    <Tab className="nav-item">
                                                        <span className="nav-link">Actualizar Imagenes a Articulos</span>
                                                    </Tab>

                                                    <Tab className="nav-item">
                                                        <span className="nav-link">Borrar Imagenes a Articulos</span>
                                                    </Tab>

                                                

                                                  
                                                </TabList>
                                            </aside>

                                            <div className="col-md-8 col-lg-9" style={ { marginTop: "1rem" } }>
                                                <div className="tab-pane">
                                                    <TabPanel>
                                                        <p style={{fontWeight: 'bold'}}>Aca va a poder asignar imagenes a articulos que no contengan (esos articulos deben existir en la base de datos)</p>
                                                        <br />
                                                        <SubirImagenes/>
                                                    </TabPanel>
                                                                                                  
                                                    <TabPanel>
                                                        <p style={{fontWeight: 'bold'}}>Aca va a poder actualizar imagenes a articulos que ya contengan (esos articulos deben existir en la base de datos)</p>
                                                        <br />
                                                        <p>Aún no esta disponible.</p>
                                                    </TabPanel>

                                                    <TabPanel>
                                                        <p style={{fontWeight: 'bold'}}>Aca va a poder eliminar imagenes a articulos que ya contengan (esos articulos deben existir en la base de datos)</p>
                                                        <br />
                                                        <p>Aún no esta disponible.</p>
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
        </>
    )
    
}