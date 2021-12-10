import React, { useState, useEffect } from 'react';
import './descripcion_fila.css'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ImageZoom from 'react-medium-image-zoom'


function DescripcionFila(props) {
    const [loaded, setLoaded] = useState(false);
    const [isOpen,setIsOpen] = useState(false);
    let { selectedRowArticulo } = props;
    
   
    //la funcion "onClick_IconCart" llama al Parent <ArticuloList/>
    function onClick_IconCart() {
        props.onClick(props.selectedRowArticulo) 
    }

    //la funcion "handleChange_CantidadArticulos" llama al Parent <ArticuloList/>
    function handleChange_CantidadArticulos(e) {     

        let valor = e.target.value;
        let max = e.target.max;
      
        if (!Number(valor)) { //si no es numerico sale
            return;
        }

        if(parseInt(valor) > parseInt(max)) { //si supero el maximo , sale
            return;
        }

        props.onChange(valor)    
    }

    //esta funcion me marca toda la casilla de texto pintada en azul
    function handleClick_CantidadArticulos (e)  {
        e.target.select();
      };

    function handleShowDialog () {
        setIsOpen(!isOpen);
      };


 


    return (

        <div id="articulo-info">
                  <div>
                        <LazyLoadImage
                            src={selectedRowArticulo.pathImagenArticulo ? selectedRowArticulo.pathImagenArticulo + '?' + Date.now() : '/assets/images/articulos/shop_encendido_alsina/sin_imagen.png'}
                            className="articulo-photo"
                            effect="blur"
                            onClick={handleShowDialog}
                            // key={Date.now()}
                        />
                        {isOpen && (
                            <Dialog 
                                className="dialog"
 
                                open
                                onClick={handleShowDialog}
                            >
                            <LazyLoadImage
                                className="image"
                                style={{ height:'500px',width:'500px',objectFit:'contain'}}
                                src={selectedRowArticulo.pathImagenArticulo ? selectedRowArticulo.pathImagenArticulo + '?' + Date.now() : '/assets/images/articulos/shop_encendido_alsina/sin_imagen.png'}
                                onClick={handleShowDialog}
                            />
                            </Dialog>
                        )}
                    </div>
                    <p 
                      className="articulo-descripcion"
                    >{selectedRowArticulo.codigoArticulo + ' --- '}  {selectedRowArticulo.descripcionArticulo} </p>
                    {
                        props.usuario && //si hay usuario cargado
                        <p 
                            className="articulo-descripcion"
                        >
                            <IconButton aria-label="delete" onClick={onClick_IconCart}>
                                <AddShoppingCartIcon fontSize="large" color="primary" /> 
                            </IconButton>
                                <input 
                                    type="number" 
                                    value={ props.cantidad } 
                                    onChange={ e => handleChange_CantidadArticulos(e)} 
                                    min="1"
                                    max="5000"
                                    onClick={e => handleClick_CantidadArticulos(e)}
                                />
                        </p>    
                    }     
      </div>
    )
  }
  
  export default DescripcionFila;
