import React from 'react';
import { Helmet } from 'react-helmet';

// import Custom Components
import PageHeader from '../../common/page-header';
import Breadcrumb from '../../common/breadcrumb';
import ArticuloList from '../../features/articulos/articulo-list';

function Catalogo( props ) {
    let grid = props.match.params.grid; //esta prop viene de components\home\index.jsx
    if ( grid !== "list") {
        window.location = process.env.PUBLIC_URL + "/pages/404";
    }

    return (
        <div>
            <Helmet>
                <title>Encendido Alsina - Catalogo</title>
            </Helmet>
            
            <h1 className="d-none">Encendido Alsina - Catalogo</h1>

            <div className="main">
                <PageHeader  subTitle="Catalogo" />
                <Breadcrumb  parent1={ [ "Catalogo", "catalogo/list" ] } adClass="mb-2" />

                <div className="page-content">
                    <div className="container">
                        <div>
                            <div>
                                <ArticuloList 
                                    column={ grid } />
                            </div>

                           

                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo( Catalogo );