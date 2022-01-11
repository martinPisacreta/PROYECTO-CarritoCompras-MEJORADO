import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import PageHeader from '../common/page-header';
import Breadcrumb from '../common/breadcrumb';
import { usuarioService , alertService} from '../../services';
import {Alert} from '../alert'
import { makeStyles } from "@material-ui/core/styles";
import './form-control.css'
import { usuarioActions } from '../../actions';
import { connect } from 'react-redux';


function ForgotPassword(props) {
    const { forgotPassword } = props;
    const initialValues = {
        email: ''
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email no es valido')
            .required('Email es requerido')
            .max(50, 'Maximo 50 caracteres'),
    });

    function onSubmit({ email }, { setSubmitting }) {
        forgotPassword(email)
        .finally(() => 
            setSubmitting(false)
        )
    }


    const useStyles = makeStyles(theme => ({
        style_button: {
            "&.btn-primary" : {
                backgroundColor: "#094293 !important", /*agregar !importantpara anular los estados */
                borderColor: "#094293 !important" /*agregar !importantpara anular los estados */
             },
            "&:hover, &:active,&:visited,&:focus" : {
                backgroundColor: "#0b52b8 !important", /*agregar !importantpara anular los estados */
                borderColor: "#0b52b8 !important" /*agregar !importantpara anular los estados */
            }
        }
    }));




    const classes = useStyles();

 

    return (
        <>
            <Helmet>
                <title>Encendido Alsina - Olvide mi contraseña</title>
            </Helmet>
            
            <h1 className="d-none">Encendido Alsina - Olvide mi contraseña</h1>
            
            <div className="main">
                <PageHeader  subTitle="Olvide mi contraseña" />
                <Breadcrumb title="Olvide mi contraseña" parent1={ [ "Iniciar Sesión", "usuario/login" ] } />

                <div className="page-content">
                        <div className="container">
                            <Alert/>
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                {({ errors, touched, isSubmitting }) => (
                                    <Form>
                                        <h3 className="card-header">Olvide mi contraseña</h3>
                                        <div className="card-body">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col">
                                                    <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${classes.style_button}`}>
                                                        {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                                        Enviar
                                                    </button>
                                                    <Link to="login" className="btn btn-link">Cancelar</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
        </>        
    )
}




const actionCreators = {
    forgotPassword : usuarioActions.forgotPassword
};



export default connect(null, actionCreators)(ForgotPassword);


