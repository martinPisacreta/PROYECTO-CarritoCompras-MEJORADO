import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';


function LoadMultipleImg  (props)  {
    const {item , widthProp , heightProp} = props;
    let existeImagenArticulo = item.articulo ? (item.articulo.pathImagenArticulo ? true  : false) : false;
    const [cargandoImagen, setCargandoImagen] = useState(true);

    const handleImageLoaded = () => {
          setCargandoImagen(false);
        }
        
    return (
            <div className="articulo-image-container">
            <img
                src={process.env.PUBLIC_URL +  (existeImagenArticulo ? (item.articulo.pathImagenArticulo  + '?' + Date.now()) : '/assets/images/articulos/shop_encendido_alsina/sin_imagen.png' +  '?' + Date.now())}
                onLoad={handleImageLoaded}
                loading="lazy"
                style={{
                    height: cargandoImagen ? '0px' : heightProp,  //si se esta cargando la imagen , pongo el height en 0
                    width: cargandoImagen ? '0px' : widthProp,   //si se esta cargando la imagen , pongo el width en 0
                    objectFit: 'contain'
                }}
                
            />
            {cargandoImagen && ( //si se esta cargando la imagen , muestro esto....
                <div 
                    className="image-container-overlay" 
                    style={{
                            display: 'flex', 
                            justifyContent: 'center'
                            }}
                >
                    <CircularProgress />
                </div>
            )}
        </div>
    )
}

export default LoadMultipleImg;