import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { usuarioService , alertService} from '../../services';


import {Alert} from '../alert'
import { Helmet } from 'react-helmet';

// import Custom Components
import PageHeader from '../common/page-header';
import Breadcrumb from '../common/breadcrumb';


import LocationSearchInput from "../location_search_input";


import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { makeStyles } from "@material-ui/core/styles";
import './form-control.css'
import { usuarioActions } from '../../actions';
import { connect } from 'react-redux';


function Dashboard_Update_User(props) {
    const usuario = JSON.parse(localStorage.getItem('user'));
    const {  updateUsuario } = props;

    const initialValues = {
        email: usuario.email,
        password: '',
        confirmacionPassword: '',
        razonSocial: usuario.razonSocial,
        cuit: usuario.cuit,
        telefono: usuario.telefono,
        nombre: usuario.nombre,
        apellido: usuario.apellido,     
        location: {
            value: '',
            address: ''
        },
        showPassword_password: false,
        showPassword_confirmacionPassword : false,
        utilidad : usuario.utilidad
    };


    const [values, setValues] = React.useState({
        showPassword: false,
      });

    const handleClickShowPassword = () => {
        setValues({showPassword: !values.showPassword });
    };

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
    

    const validationSchema = Yup.object().shape({
        nombre: Yup.string()
            .required('Se requiere el nombre')
            .max(50, 'Maximo 50 caracteres'),
        apellido: Yup.string()
            .required('Se requiere el apellido')
            .max(50, 'Maximo 50 caracteres'),
        email: Yup.string()
            .email('Email no es valido')
            .required('Email es requerido')
            .max(50, 'Maximo 50 caracteres'),
        password: Yup.string()
            .concat(null)
            // .matches(
            //     "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
            //     "Mínimo ocho caracteres, al menos una letra y un número"
            // )
            .min(8, 'La contraseña debe tener al menos 8 caracteres')
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
            .max(15, 'Maximo 15 caracteres'),
        razonSocial: Yup.string()
            .required('Se requiere razon social')
            .max(50, 'Maximo 50 caracteres'),
        cuit: Yup.string()
            // .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Solo se aceptan números')
            .max(11, 'Maximo 11 caracteres')
            .min(11, 'Minimo 11 caracteres')
            .required('Se requiere cuit'),
        telefono: Yup.string()
            // .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Solo se aceptan números')
            .max(11, 'Maximo 11 caracteres')
            .min(8, 'Minimo 8 caracteres')
            .required('Se requiere teléfono'),   
        location: Yup.object().shape({
            value: Yup.string().required("Dirección es requerida").max(200, 'Maximo 200 caracteres'),
            address: Yup.string().required("Dirección invalida").max(200, 'Maximo 200 caracteres')
            }),   
        utilidad: Yup.number()
        .required('Se requiere utilidad')
        .integer()
        .min(1,"No puede escribir un valor menor a 1")
        .max(100,"No puede escribir un valor mayor a 100") 
    });


    function onSubmit(fields, { setStatus, setSubmitting }) {
        const data = 
        {
            apellido: fields.apellido,
            cuit: fields.cuit,
            direccionDescripcion: fields.location.address,
            direccionValor: fields.location.value,
            email: fields.email,
            lat: fields.location.coordinates.lat.toString(),
            lng: fields.location.coordinates.lng.toString(),
            nombre: fields.nombre,
            password: fields.password,       
            razonSocial: fields.razonSocial,
            telefono: fields.telefono,
            utilidad: fields.utilidad
            
        }
        setStatus();

        updateUsuario(usuario.idUsuario, data)
        .finally(setSubmitting(false))
    }

    const [isDeleting, setIsDeleting] = useState(false);
    function onDelete() {
        if (window.confirm('Esta seguro?')) {
            setIsDeleting(true);
            usuarioService.delete(usuario.idUsuario)
                .then(() => alertService.success('Cuenta eliminada exitosamente'))
                .catch(error => {
                    alertService.error(error);
                  });
        }
    }

    function onChange(e){
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
           this.setState({value: e.target.value})
        }
     }

    return (
        <>
            <Helmet>
                <title>Encendido Alsina - Mi Cuenta</title>
            </Helmet>
            
            <h1 className="d-none">Encendido Alsina - Mi Cuenta</h1>
            
            <div className="main">
                <PageHeader  subTitle="Mi Cuenta" />
                <Breadcrumb  parent1={  [ "Mi Cuenta", "usuario/dashboard" ] } />

                <div className="page-content">
                    <div className="container">
                        <Alert/>
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                            {({ errors, touched, isSubmitting ,setFieldValue , values}) => (
                                
                                <Form>
                                    <h1>Actualización del perfil</h1>
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <Field name="nombre" type="text" className={'form-control' + (errors.nombre && touched.nombre ? ' is-invalid' : '')} />
                                        <ErrorMessage name="nombre" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellido</label>
                                        <Field name="apellido" type="text" className={'form-control' + (errors.apellido && touched.apellido ? ' is-invalid' : '')} />
                                        <ErrorMessage name="apellido" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label>Razon Social</label>
                                        <Field name="razonSocial" type="text" className={'form-control' + (errors.razonSocial && touched.razonSocial ? ' is-invalid' : '')} />
                                        <ErrorMessage name="razonSocial" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label>Cuit </label>
                                        <Field 
                                            name="cuit" 
                                            type="text" 
                                            className={'form-control' + (errors.cuit && touched.cuit ? ' is-invalid' : '')}
                                            values={values.cuit}
                                            onChange={e => {
                                                const re = /^[0-9\b]+$/;
                                                if (e.target.value === '' || re.test(e.target.value)) {
                                                    setFieldValue("cuit",  e.target.value)
                                                }
                                            }}
                                        />
                                        <ErrorMessage name="cuit" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label>Direccion</label>
                                        <Field name="location" component={LocationSearchInput} idUsuario={usuario.idUsuario}  className={'form-control' + (errors.location && touched.location && touched.location.value  ? ' is-invalid' : '')}/>
                                        {errors.location && errors.location.value && <ErrorMessage name='location.value'  component="div" className="invalid-feedback" />}
                                        {errors.location && !errors.location.value && errors.location.address && <ErrorMessage name='location.address'  component="div" className="invalid-feedback" />}
                                    </div>
                                    <div className="form-group">
                                        <label>Telefono </label>
                                        <Field 
                                            name="telefono" 
                                            type="text" 
                                            className={'form-control' + (errors.telefono && touched.telefono ? ' is-invalid' : '')}
                                            values={values.telefono}
                                            onChange={e => {
                                                const re = /^[0-9\b]+$/;
                                                if (e.target.value === '' || re.test(e.target.value)) {
                                                    setFieldValue("telefono",  e.target.value)
                                                }
                                            }}
                                        />
                                        <ErrorMessage name="telefono" component="div" className="invalid-feedback" />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <Field name="email" type="text" disabled = {true} className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className="form-group">
                                        <label>Utilidad</label>
                                        <Field name="utilidad" type="number"  className={'form-control' + (errors.utilidad && touched.utilidad ? ' is-invalid' : '')}  />
                                        <ErrorMessage name="utilidad" component="div" className="invalid-feedback" />
                                    </div>
                                    <h3 className="pt-3">Cambiar contraseña</h3>
                                    <p>Dejar en blanco para mantener la misma contraseña</p>
                                    <div className="form-row">
                                        <div className="form-group col">
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
                                        <div className="form-group col">
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
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${classes.style_button}`} style={{marginRight : 20}}>
                                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                            Actualizar
                                        </button>
                                        {/* <button type="button" onClick={() => onDelete()} className="btn btn-danger"  disabled={isDeleting} style={{marginRight : 20}}>
                                            {isDeleting && <span className="spinner-border spinner-border-sm"></span>}
                                             Borrar
                                        </button> */}
                                        <Link to="./dashboard" className="btn btn-link" style={{marginRight : 20}}>Cancelar</Link>
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
    
    updateUsuario: usuarioActions.update
};



export default connect(null, actionCreators)(Dashboard_Update_User);


