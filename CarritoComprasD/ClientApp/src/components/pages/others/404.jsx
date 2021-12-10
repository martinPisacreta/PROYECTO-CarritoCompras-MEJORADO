import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// import Custom Components
import Breadcrumb from '../../common/breadcrumb';

function ErrorPage() {
    return (
        <div className="main">
            <Helmet>
                <title>Encendido Alsina - 404 Página</title>
            </Helmet>

            <PageHeader  subTitle="404 Página" />
            <Breadcrumb parent1={ [ "404", "pages/404" ] } adClass="mb-2" />


            <div className="error-content text-center" style={ { backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/backgrounds/error-bg.jpg)` } }>
                <div className="container">
                    <h1 className="error-title">Error 404</h1>

                    <p>Lo sentimos, la página que ha solicitado no está disponible..</p>
                    <Link to="" className="btn btn-outline-primary-2 btn-minwidth-lg">
                        <span>VOLVER AL INICIO</span>
                        <i className="icon-long-arrow-right"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default React.memo( ErrorPage );
