import React, { useState, useEffect } from 'react';
import { articulosUploadImageService}  from '../../../services';
import { makeStyles } from "@mui/styles";
import { Formik, Form } from 'formik';


export default function SubirImagenes ()  {

    const [respuesta,setRespuesta] = useState(null);
    const [error,setError] = useState(null);
   
    //color del boton UPLOAD
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

      


    function onSubmit({ conjuntoImagenes }, { setSubmitting }) {
        try
        {
            setRespuesta(null);
            setError(null);
            
            let tamañoConjuntoImagenes = 0;
            var formData = new FormData();
            for (const key of Object.keys(conjuntoImagenes)) {
                tamañoConjuntoImagenes += conjuntoImagenes[key].size;
                formData.append('conjuntoImagenes', conjuntoImagenes[key]);
            }

            //DE FORMA PREDETERMINADA EL VALOR MAXIMO PARA SUBIR IMAGENES ES DE 30000000 BYTES
            if(tamañoConjuntoImagenes >= 30000000)
            {
                setError("El conjunto de imagenes es igual o mayor a 28.61 MB");
            }
            else
            {
                articulosUploadImageService.uploadFilesInServer(formData)
                .then(res => {
                    setRespuesta(res);
                    setError(null);
                })
                .catch(err => {
                    setError(err);
                });
            }
        }
        catch (error) {
            setError(error);
          }
        finally {
            setSubmitting(false)
        }


    }

  
    const classes = useStyles();

    return (
        <div>
            <div className="container">
                <div className="row">
                    

                    <Formik 
                        initialValues={{ conjuntoImagenes: ''}}
                        onSubmit={onSubmit}>
                        {({ setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <input 
                                    type="file" 
                                    name="conjuntoImagenes" 
                                    accept="image/*"
                                    onChange={(event) =>{setFieldValue("conjuntoImagenes", event.target.files);}} 
                                    multiple 
                                />
                            </div>
                            <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${classes.style_button}`}>     
                                {/* si isSubmitting es true , osea hice click , muestro un cursor dando vueltas sobre el boton Login */}
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Subir Imagenes
                            </button>
                        </Form>
                        )}
                    </Formik>
                </div>

                <br/>
                    
                {
                    error 
                        ?
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    :
                        (
                            respuesta && 
                                <div>
                                    <div>
                                        <div className="alert alert-success" role="alert">
                                            Imagenes que subieron bien ({respuesta.imagenes_bien_subidas_cantidad}/{respuesta.imagenes_a_subir_cantidad})
                                        </div>
                                        {
                                            respuesta.imagenes_bien_subidas.map((number) =>
                                            <li key={number.toString()}>
                                                {number}
                                            </li>)
                                            
                                        }
                                    </div>

                                    <br/>
                                
                                    <div>
                                        <div className="alert alert-warning" role="alert">
                                            ¡ATENCIÓN! , estas imagenes no se pudieron subir por algun motivo : ({respuesta.imagenes_atencion_cantidad}/{respuesta.imagenes_a_subir_cantidad})
                                        </div>
                                        {
                                            respuesta.imagenes_atencion.map((number) =>
                                            <li key={number.toString()}>
                                                {number}
                                            </li>)
                                            
                                        }
                                    </div>  
                            
                                    <br/>

                                    <div>
                                        <br/>
                                        <div className="alert alert-danger" role="alert">
                                            ¡ERROR! , estas imagenes no se pudieron subir por algun motivo : ({respuesta.imagenes_errores_cantidad}/{respuesta.imagenes_a_subir_cantidad})
                                        </div>   
                                        {
                                            respuesta.imagenes_errores.map((number) =>
                                            <li key={number.toString()}>
                                                {number}
                                            </li>)
                                            
                                        }
                                    </div>
                                </div>
                            
                        )
            }
            </div>
          
        </div>
    )
    
}