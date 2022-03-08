import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// import Custom Components
import PageHeader from '../../common/page-header';
import Breadcrumb from '../../common/breadcrumb';

import { quantityInputs} from '@utils';
import { usuarioPedidoActions } from '@actions';
import { connect } from 'react-redux';
import LoadMultipleImg from '../../common/load-multiple-img'
import { history } from '@helpers';

function Carrito( props ) {
    const { usuarioPedido , modificarArticuloPedido , finalizarPedido , eliminarArticuloPedido , empresa} = props;
    const [loading,setLoading] = useState(false);
    const [modificandoArticulo , setModificandoArticulo] = useState(false);
    const [eliminandoArticulo , setEliminandoArticulo] = useState(false);
    const usuario = JSON.parse(localStorage.getItem('user'));


   


    useEffect( () => {  
        quantityInputs();
    } )

 
     //modifico la cantidad de un articulo
    function onModificarArticulo( idUsuario, e , idArticulo ) {
        setModificandoArticulo(true)
        
        modificarArticuloPedido(idUsuario,idArticulo,e.currentTarget.querySelector( 'input[type="number"]' ).value )
        .finally(setModificandoArticulo(false))
    }

    function onEliminarArticulo(idUsuario,idArticulo ) {
        setEliminandoArticulo(true)
        
        eliminarArticuloPedido( idUsuario,idArticulo )
        .finally(setEliminandoArticulo(false))
    }

    

    async function goToCheckout() {
        setLoading(true)
       
        const _usuarioPedidoDetalles = usuarioPedido.usuarioPedidoDetalle.map(function(cl) {
            return {
                cantidad : parseInt(cl.cantidad),
                txtDescMarca: cl.marcaArticulo,
                codigoArticulo: cl.codigoArticulo,
                precioListaPorCoeficientePorMedioIva: cl.precioListaPorCoeficientePorMedioIva,
                
                
                
            }
         })



        const pedido = {
            idUsuario: usuario.idUsuario,
            usuarioPedidoDetalle: _usuarioPedidoDetalles,
            idEmpresa : empresa.idEmpresa,
            total: usuarioPedido.total
        }



        

        await finalizarPedido(pedido)
        .then(() => {
            setLoading (false);
            history.push('/'); 
        })
        .catch(() => {
            setLoading (false);
        });

    }

    
    return (
        <div>


            
            <Helmet>
                <title>Encendido Alsina</title>
            </Helmet>

            <h1 className="d-none">Encendido Alsina</h1>

            <div className="main" style={loading ? {pointerEvents: "none", opacity: "0.4"} : {}}>
                <PageHeader  subTitle="Carrito de Compras" />
                <Breadcrumb title="Carrito de Compras" parent1={ [ "Catalogo", "catalogo/list" ] } />

                <div className="page-content" >
                    <div className="cart">
                        <div className="container">
                            <div className="row">
                                 <div className="col-lg-9"> {/*cuando se aprieta FINALIZAR PEDIDO se bloquea todo el div hasta que se finalize el pedido */}
                                    <table className="table table-cart table-mobile">
                                        <thead>
                                            <tr>
                                                <th>Articulo</th>
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            { usuarioPedido && usuarioPedido.usuarioPedidoDetalle
                                                ?
                                                    usuarioPedido.usuarioPedidoDetalle.map( ( item, index ) =>
                                                        <tr key={ index }>
                                                            <td className="articulo-col">
                                                                <div className="articulo">
                                                                    <figure style={{width:'60px',height:'60px'}}>
                                                                        <LoadMultipleImg 
                                                                            item = {item}
                                                                            widthProp = '60px'
                                                                            heightProp = '60px' 
                                                                        />
                                                                    </figure>
                                                                    
                                                                    <span>  </span>

                                                                    <h3 className="articulo-title">
                                                                        <Link to="#">{ item.codigoArticulo }</Link>
                                                                    </h3>
                                                                </div>
                                                            </td>

                                                            <td className="price-col">
                                                                ${
                                                                    item.precioListaPorCoeficientePorMedioIva.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } )
                                                                }
                                                            </td>

                                                            <td className="quantity-col">
                                                                <div 
                                                                    className='cart-articulo-quantity'  
                                                                    onClick={ ( e ) => onModificarArticulo(usuario.idUsuario, e , item.articulo.id ) }   //modifico la cantidad de un articulo
                                                                    style={modificandoArticulo ? {pointerEvents: "none", opacity: "0.4"} : {}}
                                                                >
                                                                    <input 
                                                                        type="number"
                                                                        className="form-control"
                                                                        defaultValue={ item.cantidad }
                                                                        min="1"
                                                                        max={ 9999 }
                                                                        step="1"
                                                                        data-decimals="0"
                                                                        required
                                                                    />
                                                                </div>
                                                            </td>

                                                            <td className="total-col">
                                                                ${ 
                                                                    (
                                                                        item.precioListaPorCoeficientePorMedioIva.toFixed(2) 
                                                                        *
                                                                        item.cantidad  
                                                                    ).toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                                }
                                                            </td>

                                                            <td className="remove-col">
                                                                <button 
                                                                    className="btn-remove" 
                                                                    onClick={ (  ) => onEliminarArticulo(usuario.idUsuario,item.articulo.id) }    
                                                                    style={eliminandoArticulo ? {pointerEvents: "none", opacity: "0.4"} : {}}
                                                                >
                                                                    <i className="icon-close"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                ) :
                                                <tr>
                                                    <td>
                                                        <p className="pl-2 pt-1 pb-1"> No hay articulos en el carrito </p>
                                                    </td>
                                                </tr>
                                            }

                                        </tbody>
                                    </table>

                                    <div className="cart-bottom">
                                       

                                        <button className="btn btn-outline-dark-2"><span>ACTUALIZAR CARRITO</span><i className="icon-refresh"></i></button>
                                    </div>
                                </div>
                                <aside className="col-lg-3">
                                    <div className="summary summary-cart">
                                        <h3 className="summary-title">Carrito Total</h3>

                                        <table className="table table-summary">
                                            <tbody>
                                                <tr className="summary-subtotal">
                                                    <td>Subtotal:</td>
                                                    <td>${usuarioPedido && usuarioPedido.total && usuarioPedido.total.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}</td>
                                                </tr>
                                               

                                                <tr className="summary-total">
                                                    <td>Total:</td>
                                                    <td>
                                                        ${usuarioPedido && usuarioPedido.total && usuarioPedido.total.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        {usuarioPedido && usuarioPedido.total > 0 && usuarioPedido.usuarioPedidoDetalle &&
                                            <button className="btn btn-outline-primary-2 btn-order btn-block" onClick={goToCheckout} disabled={loading}>
                                                {loading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                                FINALIZAR PEDIDO
                                            </button>
                                        }
                                    </div>

                                    <Link to={ `${process.env.PUBLIC_URL}/catalogo/list` } className="btn btn-outline-dark-2 btn-block mb-3"><span>CONTINUAR COMPRANDO</span><i className="icon-refresh"></i></Link>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return { //cualquier cosa que retorno aca , va a estar disponible como propiedad (props) en nuestro componente
        usuarioPedido: state.usuarioPedidoReducer.usuarioPedido ? state.usuarioPedidoReducer.usuarioPedido : [],
        empresa: state.empresaReducer.empresa
    }
  }



const actionCreators = {
    eliminarArticuloPedido: usuarioPedidoActions.eliminarArticuloPedido,
    modificarArticuloPedido: usuarioPedidoActions.modificarArticuloPedido, //modifico la cantidad de un articulo
    finalizarPedido: usuarioPedidoActions.finalizarPedido
};



export default connect(mapStateToProps, actionCreators)(Carrito);

