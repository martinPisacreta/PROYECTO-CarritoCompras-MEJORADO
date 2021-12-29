import React, { useState } from 'react';
import './descripcion_fila.css'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';

function DescripcionFila(props) {
    let { selectedRowArticulo , imagenCargada , setImagenCargada , onClick , onChange , usuario , cantidad} = props;
    const [isOpen,setIsOpen] = useState(false);
    const [imagenCargadaDialog, setImagenCargadaDialog] = useState(false);

    function onClick_IconCart() {
        //selectedRowArticulo -> viene de <ArticuloDevExpresList/>
        //onClick -> viene de <ArticuloDevExpresList/> , y llama a onClick_IconCart de <ArticuloDevExpresList/>
        onClick(selectedRowArticulo)
    }

   
    function handleChange_CantidadArticulos(e) {     

        let valor = e.target.value;
        let max = e.target.max;
      
        if (!Number(valor)) { //si no es numerico sale
            return;
        }

        if(parseInt(valor) > parseInt(max)) { //si supero el maximo , sale
            return;
        }

        //onChange -> viene de <ArticuloDevExpresList/> , y llama a handleChange_CantidadArticulos de <ArticuloDevExpresList/>
        onChange(valor)
    }

    //esta funcion me marca toda la casilla de texto pintada en azul
    function handleClick_CantidadArticulos (e)  {
        e.target.select();
      };

    // imagenCargada viene del <ArticuloDevExpresList/>
    // setImagenCargada viene del <ArticuloDevExpresList/>
    function  handleImageLoaded() {
        if (!imagenCargada) { 
            setImagenCargada(true)
            
        }
    } 

    function handleShowDialog () {
        setImagenCargadaDialog(false)
        setIsOpen(!isOpen);
      };

 
    function  handleImageLoadedDialog() {
        if (!imagenCargadaDialog) { 
            setImagenCargadaDialog(true)
        }
    } 


    


    return (
        <>
        <div id="articulo-info" >
            <div>    
                <div className="articulo-photo">
                    <img
                        src={selectedRowArticulo.pathImagenArticulo ? selectedRowArticulo.pathImagenArticulo + '?' + Date.now() : '/assets/images/articulos/shop_encendido_alsina/sin_imagen.png'} //selectedRowArticulo -> viene de <ArticuloDevExpresList/>
                        onLoad={handleImageLoaded}
                        height={!imagenCargada ? 0 : '150px'} //si no esta cargada la imagen , pongo el height en 0
                        width={!imagenCargada  ? 0  : '150px'}  //si no esta cargada la imagen , pongo el width en 0
                        onClick={handleShowDialog}
                        loading="lazy"
                        
                    />
                    {!imagenCargada && ( //si no esta cargada la imagen muestro esto....
                        <div className="image-container-overlay" style={{display: 'flex', justifyContent: 'center'}}>
                            <CircularProgress />
                        </div>
                    )}
                </div>
                {isOpen && (
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={open}
                        onClick={handleShowDialog}
                    >   
                        <img
                            src={selectedRowArticulo.pathImagenArticulo ? selectedRowArticulo.pathImagenArticulo + '?' + Date.now() : '/assets/images/articulos/shop_encendido_alsina/sin_imagen.png'} //selectedRowArticulo -> viene de <ArticuloDevExpresList/>
                            onLoad={handleImageLoadedDialog}
                            height={!imagenCargadaDialog && 0} //si no esta cargada la imagen , pongo el height en 0
                            width={!imagenCargadaDialog && 0}  //si no esta cargada la imagen , pongo el width en 0
                            onClick={handleShowDialog}
                            loading="lazy"
                            style={{height: '500px' , widht: '500px'}}
                        />
                        {!imagenCargadaDialog && ( //si no esta cargada la imagen muestro esto....
                                <Stack gap={1} justifyContent="center" alignItems="center">
                                    <CircularProgress color="inherit" />
                                </Stack>
                        )}
                    </Backdrop>
                )}
            </div>
            <p 
                className="articulo-descripcion"
            >
                {/* selectedRowArticulo -> viene de <ArticuloDevExpresList/> */}
                {selectedRowArticulo.codigoArticulo + ' --- '}  {selectedRowArticulo.descripcionArticulo} 
            </p>
            {
                
                usuario && //usuario -> viene de <ArticuloDevExpresList/> 
                <p 
                    className="articulo-descripcion"
                >
                    <IconButton aria-label="delete" onClick={onClick_IconCart}>
                        <AddShoppingCartIcon fontSize="large" color="primary" /> 
                    </IconButton>
                        <input 
                            type="number" 
                            value={ cantidad  }  // cantidad -> viene de <ArticuloDevExpresList/> 
                            onChange={ e => handleChange_CantidadArticulos(e)} 
                            min="1"
                            max="5000"
                            onClick={e => handleClick_CantidadArticulos(e)}
                        />
                </p>    
            }     
        </div>
      </>
    )
  }
  
  export default DescripcionFila;