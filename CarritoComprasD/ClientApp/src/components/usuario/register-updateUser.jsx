import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet';
import PageHeader from '../common/page-header';
import Breadcrumb from '../common/breadcrumb';
import LocationSearchInput from "../location_search_input/index";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { makeStyles } from "@mui/styles";
import './form-control.css'
import { usuarioActions } from '@actions';
import { connect } from 'react-redux';
import { usuarioService } from '@services'

function Register_UpdateUser(props) {


    //deDondeVengo -> si es 1 voy a registrar un usuario , si es 2 voy a updetear un usuario
    const { deDondeVengo} = props.location.state;

 
    const usuario = usuarioService.usuarioValue;
    const {  registerUsuario , updateUsuario } = props;

  
   
    const initialValues = {      
        email: deDondeVengo === 1 ? '' : usuario.email,
        password: '',
        confirmacionPassword: '',
        razonSocial: deDondeVengo === 1 ? '' : usuario.razonSocial,
        cuit: deDondeVengo === 1 ? '' : usuario.cuit,
        location: {
            value: '',
            address: ''
        },
        telefono: deDondeVengo === 1 ? '' : usuario.telefono,
        nombre: deDondeVengo === 1 ? '' : usuario.nombre,
        apellido: deDondeVengo === 1 ? '' : usuario.apellido,    
        showPassword_password: false,
        showPassword_confirmacionPassword : false,
        utilidad : deDondeVengo === 1 ? 20 : usuario.utilidad
        
    }




    function onSubmit(fields, { setStatus, setSubmitting }) {
        if(deDondeVengo === 1) {
            const usuario = 
                {
                Apellido: fields.apellido,  
                Cuit: fields.cuit,
                DireccionDescripcion: fields.location.address, 
                DireccionValor: fields.location.value,
                Email: fields.email, 
                Lat: fields.location.coordinates.lat.toString(), 
                Lng: fields.location.coordinates.lng.toString(), 
                Nombre: fields.nombre, 
                Password: fields.password,       
                RazonSocial: fields.razonSocial, 
                Telefono: fields.telefono, 
                Utilidad: 20
                
                }

                setStatus();

                registerUsuario(usuario)
                .catch(() => 
                    setSubmitting(false)
                )
        }
        else if(deDondeVengo === 2) {
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
            .catch(() => 
                    setSubmitting(false)
                )
        }
        

      
    }


    

    const useStyles = makeStyles(() => ({
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

  
    
    
    if(deDondeVengo === 1) {
        var validationSchema = Yup.object().shape({
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
                // aceptaTerminos: Yup.bool()
                //     .oneOf([true], 'Acepta Términos & Condiciones es requerido'),
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
                    })
        });
    }
    else if(deDondeVengo === 2) {
        var validationSchema = Yup.object().shape({
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
    }


    const classes = useStyles();

    return( 

        <div>
                <Helmet>
                    {deDondeVengo === 1 && <title>Encendido Alsina - Registrarse</title>}
                    {deDondeVengo === 2 && <title>Encendido Alsina - Mi Cuenta</title>}
                </Helmet>
                
                {deDondeVengo === 1 && <h1 className="d-none">Encendido Alsina - Registrarse</h1>}
                {deDondeVengo === 2 && <h1 className="d-none">Encendido Alsina - Mi Cuenta</h1>}
                
                <div className="main">
                    {
                        deDondeVengo === 1 && 
                        <div>
                            <PageHeader  subTitle="Registrarse" />
                            <Breadcrumb title="Registrarse" parent1={ [ "Iniciar Sesión", "usuario/login" ] } />
                        </div>
                    }
                    {
                        deDondeVengo === 2 && 
                        <div>
                            <PageHeader  subTitle="Mi Cuenta" />
                            <Breadcrumb  parent1={  [ "Mi Cuenta", "usuario/dashboard" ] } />
                        </div>
                    }

                  
                    <div className="page-content">
                            <div className="container">
                           
                                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                                    {({ errors, touched, isSubmitting , setFieldValue,values }) => (
                                        <Form> 
                                            {
                                                deDondeVengo === 1 && <h3 className="card-header">Registrar</h3>
                                            }
                                            {
                                                deDondeVengo === 2 &&  <h1>Actualización del perfil</h1>
                                            }
                                            <div className="card-body">
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
                                                    {
                                                        deDondeVengo === 1 &&
                                                        <div className="form-group">
                                                            <label>Direccion</label>
                                                            {/* paso id={0} porque no existe el usuario todavia , ese id hace referencia al id del usuario  */}
                                                            <Field name="location" component={LocationSearchInput} id={0} className={'form-control' + (errors.location && touched.location && touched.location.value  ? ' is-invalid' : '')}/> 
                                                            {errors.location && errors.location.value && <ErrorMessage name='location.value'  component="div" className="invalid-feedback" />}
                                                            {errors.location && !errors.location.value && errors.location.address && <ErrorMessage name='location.address'  component="div" className="invalid-feedback" />}
                                                        </div>
                                                    }
                                                    {
                                                        deDondeVengo === 2 &&
                                                        <div className="form-group">
                                                            <label>Direccion</label>
                                                            <Field name="location" component={LocationSearchInput} idUsuario={usuario.idUsuario}  className={'form-control' + (errors.location && touched.location && touched.location.value  ? ' is-invalid' : '')}/>
                                                            {errors.location && errors.location.value && <ErrorMessage name='location.value'  component="div" className="invalid-feedback" />}
                                                            {errors.location && !errors.location.value && errors.location.address && <ErrorMessage name='location.address'  component="div" className="invalid-feedback" />}
                                                        </div>
                                                    }
                                                   
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
                                                        <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                    </div>

                                                    {
                                                        deDondeVengo === 2 && 
                                                            <div className="form-group">
                                                                <label>Utilidad</label>
                                                                <Field name="utilidad" type="number"  className={'form-control' + (errors.utilidad && touched.utilidad ? ' is-invalid' : '')}  />
                                                                <ErrorMessage name="utilidad" component="div" className="invalid-feedback" />
                                                            </div>
                                                    }
                                                 
                                                    {
                                                        deDondeVengo === 2 &&
                                                            <div>
                                                                <h3 className="pt-3">Cambiar contraseña</h3>
                                                                <p>Dejar en blanco para mantener la misma contraseña</p>
                                                            </div>
                                                    }
                                                 
                                             
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
                                                        <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${classes.style_button}`}>
                                                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}

                                                            {
                                                                deDondeVengo === 1 &&  "Registrar"
                                                            }
                                                            {
                                                                deDondeVengo === 2 &&  "Actualizar"
                                                            }
                                                           
                                                        </button>
                                                            {
                                                                deDondeVengo === 1 &&  <Link to="login" className="btn btn-link">Cancelar</Link>
                                                            }
                                                            {
                                                                deDondeVengo === 2 &&  <Link to="./dashboard" className="btn btn-link">Cancelar</Link>
                                                            }
                                                        
                                                    </div>
                                            </div>
                                        </Form>
                                        )}
                                </Formik>
                            </div>
                    </div>
                </div>
        </div>
       )
      
    }
    

    
    const actionCreators = {
        updateUsuario: usuarioActions.update,
        registerUsuario: usuarioActions.register
    };
    
    
    
    export default connect(null, actionCreators)(Register_UpdateUser);
