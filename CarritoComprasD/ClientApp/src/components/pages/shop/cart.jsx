import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// import Custom Components
import PageHeader from '../../common/page-header';
import Breadcrumb from '../../common/breadcrumb';

import { quantityInputs} from '../../../utils';
import {Alert} from '../../alert'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { usuarioPedidoDetalleActions , usuarioPedidoActions } from '../../../actions';


function Carrito( props ) {
    const { usuarioPedido , cambiarCantidadArticuloPedido , finalizarPedido , eliminarArticuloPedido} = props;
    let pedidoDetalle = usuarioPedido ? usuarioPedido.usuarioPedidoDetalle : [];
  
    const [loading,setLoading] = useState(false);

    const empresa = JSON.parse(localStorage.getItem('empresa'));
    const usuario = JSON.parse(localStorage.getItem('user'));

    useEffect( () => {  
        quantityInputs();
    } )

 
    function onChangeQty( e, articuloId ) {
        cambiarCantidadArticuloPedido( articuloId, e.currentTarget.querySelector( 'input[type="number"]' ).value );
    }

    function goToCheckout() {
        setLoading(true)
       
        const _usuarioPedidoDetalles = pedidoDetalle.map(function(cl) {
            return {
                codigoArticulo: cl.codigoArticulo,
                descripcionArticulo: cl.descripcionArticulo,
                txtDescMarca: cl.marcaArticulo,
                txtDescFamilia: cl.familiaArticulo,
                precioListaPorCoeficientePorMedioIva: cl.precioListaPorCoeficientePorMedioIva,
                utilidad: usuario.utilidad,
                snOferta: cl.ofertaArticulo,
                precioLista: cl.precioListaArticulo,
                coeficiente: cl.coeficienteArticulo,
                cantidad : parseInt(cl.qty),
                
            }
         })



        const pedido = {
            idUsuario: usuario.id,
            idUsuarioNavigation: usuario,
            usuarioPedidoDetalles: _usuarioPedidoDetalles,
            idEmpresaNavigation : empresa,
            total
        }


        finalizarPedido(pedido);
    }

    
    return (
        <>


            
            <Helmet>
                <title>Encendido Alsina</title>
            </Helmet>

            <h1 className="d-none">Encendido Alsina</h1>

            <div className="main">
                <PageHeader  subTitle="Carrito de Compras" />
                <Breadcrumb title="Carrito de Compras" parent1={ [ "Catalogo", "catalogo/list" ] } />

                <div className="page-content">
                    <div className="cart">
                        <div className="container">
                            <div className="row">
                                 <div className="col-lg-9" style={ loading ? { pointerEvents:'none'} : {}}> {/*cuando se aprieta FINALIZAR PEDIDO se bloquea todo el div hasta que se finalize el pedido */}
                                    <Alert/>
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
                                            { pedidoDetalle.length > 0 ?
                                                pedidoDetalle.map( ( item, index ) =>
                                                    <tr key={ index }>
                                                        <td className="articulo-col">
                                                            <div className="articulo">
                                                                <figure style={{width:'60px',height:'60px'}}>
                                                                        <LazyLoadImage src={ process.env.PUBLIC_URL  + item.pathImagenArticulo ? item.pathImagenArticulo + '?' + Date.now()  : '/assets/images/articulos/shop_encendido_alsina/sin_imagen.png'} alt="Articulo" />
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
                                                            <div className="cart-articulo-quantity" onClick={ ( e ) => onChangeQty( e, item.id ) }>
                                                                <input 
                                                                    type="number"
                                                                    className="form-control"
                                                                    defaultValue={ item.qty }
                                                                    min="1"
                                                                    max={ item.stockArticulo }
                                                                    step="1"
                                                                    data-decimals="0"
                                                                    required
                                                                />
                                                            </div>
                                                        </td>

                                                        <td className="total-col">
                                                            ${ item.sum.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) }
                                                        </td>

                                                        <td className="remove-col">
                                                            <button className="btn-remove" onClick={ ( e ) => eliminarArticuloPedido( item.id ) }><i className="icon-close"></i></button>
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
                                                    <td>${ total.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) }</td>
                                                </tr>
                                               

                                                <tr className="summary-total">
                                                    <td>Total:</td>
                                                    <td>
                                                        ${ (total).toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        {pedidoDetalle.length > 0 &&
                                        <button className="btn btn-outline-primary-2 btn-order btn-block" onClick={goToCheckout} disabled={loading}>
                                            {loading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                            FINALIZAR PEDIDO
                                        </button>}
                                    </div>

                                    <Link to={ `${process.env.PUBLIC_URL}/catalogo/list` } className="btn btn-outline-dark-2 btn-block mb-3"><span>CONTINUAR COMPRANDO</span><i className="icon-refresh"></i></Link>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


const mapStateToProps = (state) => {
    return { //cualquier cosa que retorno aca , va a estar disponible como propiedad (props) en nuestro componente
        usuarioPedido: state.usuarioPedidoDetalleReducer.usuarioPedido ? state.usuarioPedidoDetalleReducer.usuarioPedido : [] 
    }
  }



const actionCreators = {
    eliminarArticuloPedido: usuarioPedidoDetalleActions.eliminarArticuloPedido,
    cambiarCantidadArticuloPedido: usuarioPedidoDetalleActions.cambiarCantidadArticuloPedido,
    finalizarPedido: usuarioPedidoActions.finalizarPedido
};



export default connect(mapStateToProps, actionCreators)(Carrito);

