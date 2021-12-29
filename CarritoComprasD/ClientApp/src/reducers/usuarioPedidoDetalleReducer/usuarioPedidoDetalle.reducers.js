import {  usuarioPedidoDetalleConstantes } from '../../actions/types';


const initialState = {
    idUsuario: 0,
    usuarioPedido: {}
}

export default function usuarioPedidoDetalleReducer( state = initialState, action ) {
    switch ( action.type ) {
         case usuarioPedidoDetalleConstantes.AGREGAR_ARTICULO_PEDIDO_SUCCESS:
            return {
               
                idUsuario: action.articuloAgregado.idUsuario,
                usuarioPedido: action.articuloAgregado.usuarioPedido
            };

        case usuarioPedidoDetalleConstantes.ELIMINAR_ARTICULO_PEDIDO_SUCCESS:
            return {
                ...state,
                v_pedidoDetalle: state.pedidoDetalle.filter( item => item.id !== action.articuloId )
            };

        case usuarioPedidoDetalleConstantes.CAMBIAR_CANTIDAD_ARTICULO_DE_UN_PEDIDO_SUCCESS:
            const v_pedidoDetalle = state.pedidoDetalle.reduce( ( _pedidoDetalle, articulo ) => {
                if ( articulo.id === action.articuloId ) {
                    _pedidoDetalle.push( { ...articulo, cantidad: action.payload.cantidad, suma: (  articulo.precioListaPorCoeficientePorMedioIva ) * action.payload.cantidad } ) // Increment cantidad
                } else {
                    _pedidoDetalle.push( articulo )
                }
                return _pedidoDetalle;
            }, [] )

            return { ...state, v_pedidoDetalle };
        default:
            return state;
    }
}

