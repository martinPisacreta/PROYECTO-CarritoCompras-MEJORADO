import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { safeContent } from '@utils';
import { usuarioPedidoActions } from '@actions';

import LoadMultipleImg from '../load-multiple-img'





function CartMenu( props ) {
    const { usuarioPedido, eliminarArticuloPedido , getPedidoNotFinalizedByIdUsuario  } = props;
   
    const existePedido = Object.entries(usuarioPedido).length === 0 ? false : true;
    const usuario = JSON.parse(localStorage.getItem('user'));
    
    useEffect(() => {
        
        async function funcionAsync() {
        
            //voy a buscar los articulos del pedido del usuario
            usuario && await getPedidoNotFinalizedByIdUsuario(usuario.idUsuario);
 
        }

        funcionAsync();
    }, [getPedidoNotFinalizedByIdUsuario]);


 
   
  
    

    return (
        <div className="dropdown cart-dropdown">
            <Link to={ usuario ? `${process.env.PUBLIC_URL}/shop/cart` : `${process.env.PUBLIC_URL}/usuario/login`} className="dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static">
                <i className="icon-shopping-cart"></i>
                <span className="cart-count">{ (usuario && existePedido) ? usuarioPedido.usuarioPedidoDetalle.length : 0 }</span>
                <span className="cart-txt">Carrito</span>
            </Link>

            {
                usuario ?
                            <div className={ `dropdown-menu dropdown-menu-right ${ !existePedido ? 'text-center' : ''}` } >
                                {
                                    !existePedido //si no existe el pedido
                                        ? <p>No hay articulos en el carrito</p> 
                                        :   <div>
                                                <div className="dropdown-cart-articulos">
                                                    { usuarioPedido.usuarioPedidoDetalle.map( ( item, index ) => {
                                                       
                                                        return (<div className="articulo" key={ index }>
                                                            
                                                            <div className="articulo-cart-details">
                                                                <h4 className="articulo-title">
                                                                    <Link to="#" dangerouslySetInnerHTML={ safeContent( item.codigoArticulo ) }></Link>
                                                                </h4>

                                                                <span className="cart-articulo-info">
                                                                    <span className="cart-articulo-qty">{ item.cantidad }</span>
                                                                    x ${ item.precioListaPorCoeficientePorMedioIva.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) }
                                                                </span>
                                                            </div>


                                                  
                                                            <LoadMultipleImg 
                                                                item = {item}
                                                                widthProp = '50px'
                                                                heightProp = '50px' 
                                                            />
                                                           

                                                            <button className="btn-remove"  title="Remove Articulo" onClick={ () => eliminarArticuloPedido( usuario.idUsuario,item.articulo.id ) }><i className="icon-close"></i></button>
                                                            
                                                        </div>)
                                                    } ) }
                                                </div>
                                                <div className="dropdown-cart-total">
                                                    <span>Total</span>

                                                    <span className="cart-total-price">${ usuarioPedido.total.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) }</span>
                                                </div>

                                                <div className="dropdown-cart-action">
                                                    <Link to={ `${process.env.PUBLIC_URL}/shop/cart` } className="btn btn-primary">Ver carrito</Link>
                                                    {/* <Link to={ `${process.env.PUBLIC_URL}/shop/checkout` } className="btn btn-outline-primary-2"><span>Pagar</span><i className="icon-long-arrow-right"></i></Link> */}
                                                </div>
                                            </div>
                                }
                            </div>
                    :
                        null
            }
        </div>
    );
}


const mapStateToProps = (state) => {
    return { //cualquier cosa que retorno aca , va a estar disponible como propiedad (props) en nuestro componente
        usuarioPedido: state.usuarioPedidoReducer.usuarioPedido ? state.usuarioPedidoReducer.usuarioPedido : [], 
    }
  }



const actionCreators = {
    eliminarArticuloPedido: usuarioPedidoActions.eliminarArticuloPedido,
    getPedidoNotFinalizedByIdUsuario: usuarioPedidoActions.getByIdUsuarioNotFinalized
};



export default connect(mapStateToProps, actionCreators)(CartMenu);
