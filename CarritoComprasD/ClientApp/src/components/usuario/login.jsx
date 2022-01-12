import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';



import { Helmet } from 'react-helmet';

// import Custom Components
import PageHeader from '../common/page-header';
import Breadcrumb from '../common/breadcrumb';
import './form-control.css'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { makeStyles } from "@mui/styles";
import { usuarioActions } from '../../actions';
import { connect } from 'react-redux';

//El componente Login contiene un formulario de inicio de sesión bastante estándar creado con la biblioteca Formik que contiene campos para emaily password.
//Al iniciar sesión correctamente, el usuario es redirigido a la página a la que intentaban acceder antes de iniciar sesión o a la página de inicio ( "/") de forma predeterminada. 
//El from path se agrega a location.state cuando la redirige el componente de ruta privada.
//En el inicio de sesión fallido, el error devuelto desde el backend se muestra en la interfaz de usuario.

function InicioSesion(props) {
    
    const { login } = props;
    const initialValues = {
        email: '',
        password: ''
    };

    const [values, setValues] = React.useState({
        showPassword: false,
      });

   
    
      const handleClickShowPassword = () => {
        setValues({showPassword: !values.showPassword });
      };
    
 
    // Yup es una validador 
    //     La constante validationSchema tiene la siguiente funcionalidad :
    //         estructura de componente Formik:
    //             email:     email 
    //                        <required> 
    //             password: string <required> 

    //             email y password son props obligatorios en mi estructura
    //             Si mi objeto no coincide con esa estructura, no es válido.
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email no es valido')
            .required('Email es requerido'),
        password: Yup.string().required('Contraseña es requerida')
    });


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
   
    function onSubmit({ email, password }, { setSubmitting }) {    
        login(email, password)
        .finally(() => 
            setSubmitting(false)
        )

    
    }




    return (

        
        <div>

        <Helmet>
            <title>Encendido Alsina - Iniciar Sesión</title>
        </Helmet>
        
        <h1 className="d-none">Encendido Alsina - Iniciar Sesión</h1>
        
        <div className="main">
            <PageHeader  subTitle="Iniciar Sesión" />
            <Breadcrumb  parent1={ [ "Iniciar Sesión", "usuario/login" ] }  adClass="mb-2" />
        
            <div className="page-content">
                <div className="container">
                         
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                            
                            {/*
                                errors , touched y isSubmitting son propiedades del componente Formik
                                errors -> se va cargando de la siguiente forma -> 
                                                                                    "email":"Email is required","password":"Password is required"
                                                                                    en donde email puede ser -> 
                                                                                                                "email":"Email is invalid"
                                                                                                                "email":"Email is required"
                                                                                                                y si esta bien , no aparece errors de mail
                                                                                    en donde password puede ser -> 
                                                                                                                "password":"Password is invalid"
                                                                                                                "password":"Password is required"
                                                                                                                y si esta bien , no aparece errors de password
                                touched -> me indica si hice click sobre name="email" o sobre  name="password" ->
                                                                                    "email":true,"password":true          
                                                                                            
                                isSubmitting -> me indica si hice click en boton Login , es true o false 
                            */}
        
                            {({ errors, touched, isSubmitting }) => (
                                
                                <Form>
                                    <h3 className="card-header">Iniciar Sesión</h3>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label>Email</label>   
        
                                            {/* si al escribir en el textBox hay un error (errors.email) y (&&) hice click en el textbox (touched.email) , muestro el textBox en rojo (is-invalid) , sino no        */}
                                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                            
                                            {/* <ErrorMessage />es un componente que representa el mensaje de error de un campo dado si ese campo ha sido visitado (es decir touched[name] === true) (y hay un errormensaje presente) */}
                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                        </div>
        
                                        <div className="form-group">
                                            <label>Contraseña</label>
                                            <IconButton 
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                                className={classes.customHoverFocus}
                                            >
                                                   {values.showPassword ? 
                                                                            <label 
                                                                                    style={{margin:'20px' ,fontWeight: 'bold',color:'red'}}
                                                                            >Ocultar contraseña</label> 
                                                                        : 
                                                                            <label style={{margin:'20px' ,fontWeight: 'bold',color:'blue'}}
                                                                            >Mostrar contraseña</label>
                                                    }
                                                   {values.showPassword ?   <Visibility  /> : <VisibilityOff />}
                                            </IconButton>
                                            <Field name="password"  type={values.showPassword ? 'text' : 'password'}  className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')}/>
                                            

                                             
                                    
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col">
                                            
                                                {/* disabled={isSubmitting} -> deshabilito el boton de Login , segun el valor de isSubmitting */}
                                                <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${classes.style_button}`}> 
        
                                                    {/* si isSubmitting es true , osea hice click , muestro un cursor dando vueltas sobre el boton Login */}
                                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
        
                                                    Iniciar Sesión
        
                                                </button>
                                                <Link to={{
                                                            pathname: "register",
                                                            state: {
                                                                deDondeVengo: 1
                                                            }
                                                        }} className="btn btn-link">Registrar</Link>
                                            </div>
                                            <div className="form-group col text-right">
                                                <Link to="forgot-password" className="btn btn-link pr-0">Olvide mi contraseña?</Link>
                                            </div>
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
    login: usuarioActions.login
};



export default connect(null, actionCreators)(InicioSesion);

