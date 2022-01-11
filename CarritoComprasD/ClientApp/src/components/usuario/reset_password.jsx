import React, { useState, useEffect } from 'react';
import { Link ,  useLocation , useHistory} from 'react-router-dom';
import queryString from 'query-string';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import PageHeader from '../common/page-header';
import Breadcrumb from '../common/breadcrumb';
import {Alert} from '../alert'

import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { makeStyles } from "@material-ui/core/styles";
import './form-control.css'
import { usuarioActions } from '../../actions';
import { connect } from 'react-redux';

function ResetPassword(props) {
    let history = useHistory();
    let location = useLocation();
    const { resetPassword ,  validateResetToken } = props;

    const TokenStatus = {
        Validating: 'Validating',
        Valid: 'Valid',
        Invalid: 'Invalid'
    }
    
    const [token, setToken] = useState(null);
    const [tokenStatus, setTokenStatus] = useState(TokenStatus.Validating);


    
    
    const useStyles = makeStyles(theme => ({
        customHoverFocus: {
            "&:hover, &.Mui-focusVisible": { backgroundColor: "transparent" }
        },
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

    useEffect(() => {
        const {token } = queryString.parse(location.search);

        // remove token from url to prevent http referer leakage
        history.replace(location.pathname);

        validateResetToken(token)
            .then(() => {
                setToken(token);
                setTokenStatus(TokenStatus.Valid);
            })
            .catch(() => {
                setTokenStatus(TokenStatus.Invalid);
            });
    }, []);

    function getForm() {
        const initialValues = {
            password: '',
            confirmacionPassword: '',
            showPassword_password: false,
            showPassword_confirmacionPassword : false
        };

        const validationSchema = Yup.object().shape({
            password: Yup.string()
                // .matches(
                //     "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
                //     "Mínimo ocho caracteres, al menos una letra y un número"
                // )
                .min(8, 'La contraseña debe tener al menos 8 caracteres')
                .required('Contraseña es requerida')
                .max(15, 'Maximo 15 caracteres'),
            confirmacionPassword: Yup.string()
                .when('password', (password, schema) => {
                    if (password) return schema.required('Confirmación de contraseña es requerida');
                })
                .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
                // .matches(
                //     "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
                //     "Mínimo ocho caracteres, al menos una letra y un número"
                // )
                .min(8, 'La contraseña debe tener al menos 8 caracteres')
                .required('Contraseña es requerida')
                .max(15, 'Maximo 15 caracteres'),
        });

        function onSubmit({ password, confirmacionPassword }, { setSubmitting }) {

            const payload = {
                token,
                password,
                confirmacionPassword
            };

            resetPassword(payload)
            .finally(() => 
                setSubmitting(false)
            )
        }


       

        return (

            <>
                <Helmet>
                    <title>Encendido Alsina - Reestablecer contraseña</title>
                </Helmet>
                
                <h1 className="d-none">Encendido Alsina - Reestablecer contraseña</h1>
                
                <div className="main">
                    <PageHeader subTitle="Reestablecer contraseña" />
                    <Breadcrumb title="Reestablecer contraseña" parent1={ [ "Iniciar Sesión", "usuario/login" ] } />
                
                    <div className="page-content">
                            <div className="container">
                            <Alert/>
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                {({ errors, touched, isSubmitting ,setFieldValue,values }) => (
                                    <Form>
                                         <div className="form-group">
                                            <label>Contraseña</label>
                                            <IconButton 
                                                aria-label="toggle password visibility"
                                                onClick={ () => setFieldValue('showPassword_password', !values.showPassword_password)}
                                                edge="end"
                                                className={classes.customHoverFocus}
                                            >
                                                {values.showPassword_password ? 
                                                                            <label 
                                                                                    style={{margin:'20px' ,fontWeight: 'bold',color:'red'}}
                                                                            >Ocultar contraseña</label> 
                                                                        : 
                                                                            <label style={{margin:'20px' ,fontWeight: 'bold',color:'blue'}}
                                                                            >Mostrar contraseña</label>
                                                    }
                                                {values.showPassword_password ?   <Visibility  /> : <VisibilityOff />}
                                            </IconButton>
                                            <Field name="password"  type={values.showPassword_password ? 'text' : 'password'}  className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')}/>
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label>Confirmar Contraseña</label>
                                            <IconButton 
                                                aria-label="toggle password visibility"
                                                onClick={ () => setFieldValue('showPassword_confirmacionPassword', !values.showPassword_confirmacionPassword)}
                                                edge="end"
                                                className={classes.customHoverFocus}
                                            >
                                                {values.showPassword_confirmacionPassword ? 
                                                                            <label 
                                                                                    style={{margin:'20px' ,fontWeight: 'bold',color:'red'}}
                                                                            >Ocultar contraseña</label> 
                                                                        : 
                                                                            <label style={{margin:'20px' ,fontWeight: 'bold',color:'blue'}}
                                                                            >Mostrar contraseña</label>
                                                    }
                                                {values.showPassword_confirmacionPassword ?   <Visibility  /> : <VisibilityOff />}
                                            </IconButton>
                                            <Field name="confirmacionPassword"  type={values.showPassword_confirmacionPassword ? 'text' : 'password'}  className={'form-control' + (errors.confirmacionPassword && touched.confirmacionPassword ? ' is-invalid' : '')}/>
                                            <ErrorMessage name="confirmacionPassword" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col">
                                                <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${classes.style_button}`}>
                                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                                    Restablecer contraseña
                                                </button>
                                                <Link to="/usuario/login" className="btn btn-link">Cancelar</Link>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                            </div>
                        </div>
                    </div>
            </>
        );
    }

    function getBody() {
        switch (tokenStatus) {
            case TokenStatus.Valid:
                return getForm();
            case TokenStatus.Invalid:
                return <div>La validación del token falló, si el token ha expirado, puede obtener uno nuevo en el <Link to="forgot-password">Olvide mi contraseña</Link></div>;
            case TokenStatus.Validating:
                return <div>Validando token ...</div>;
        }
    }

    return (
        <div>
            <div className="card-body">{getBody()}</div>
        </div>
    )
}



const actionCreators = {
    resetPassword : usuarioActions.resetPassword,
    validateResetToken : usuarioActions.validateResetToken
    
};



export default connect(null, actionCreators)(ResetPassword);
