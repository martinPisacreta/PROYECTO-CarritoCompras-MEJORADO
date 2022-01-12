import React, { useState, useEffect } from 'react';
import { Link , useLocation , useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Helmet } from 'react-helmet';
import PageHeader from '../common/page-header';
import Breadcrumb from '../common/breadcrumb';
import {Alert} from '../alert'
import './form-control.css'
import { usuarioActions } from '@actions';
import { connect } from 'react-redux';


function VerifyEmail(props) {

    let history = useHistory();
    let location = useLocation();
    const { verifyEmail } = props;
    const EmailStatus = {
        Verifying: 'Verifying',
        Failed: 'Failed'
    }

    const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

    useEffect(() => {
       
        const { token } = queryString.parse(location.search);
         // remove token from url to prevent http referer leakage
         history.replace(location.pathname);

        verifyEmail(token)
        .catch(() => {
            setEmailStatus(EmailStatus.Failed);
        });
    }, []);

    function getBody() {
        switch (emailStatus) {
            case EmailStatus.Verifying:
                return <div>Verificando...</div>;
            case EmailStatus.Failed:
                return <div>La verificación falló, también puede verificar su cuenta usando el <Link to="forgot-password">Olvide mi contraseña</Link></div>;
        }
    }

    return (

        <div>
            <Helmet>
                <title>Encendido Alsina - Verificar email</title>
            </Helmet>
            
            <h1 className="d-none">Encendido Alsina - Verificar email</h1>
            
            <div className="main">
                <PageHeader  subTitle="Verificar email" />
                <Breadcrumb title="Verificar email" parent1={ [ "Iniciar Sesión", "usuario/login" ] } />
            
                <div className="page-content">
                        <div className="container">
                            <Alert/>
                            <div>
                                <h3 className="card-header">Verificar email</h3>
                                <div className="card-body">{getBody()}</div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}





const actionCreators = {
    verifyEmail : usuarioActions.verifyEmail
};



export default connect(null, actionCreators)(VerifyEmail);

