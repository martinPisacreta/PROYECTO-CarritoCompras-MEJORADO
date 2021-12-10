import {  usuarioPedidoConstantes } from '../../actions/types';


const initialState = {
    precioTotalPedido: 0,
    cantidadArticulosPedido: 0
}

export default function usuarioPedidoReducers( state = initialState, action ) {
    switch ( action.type ) {
        case usuarioPedidoConstantes.GET_PRECIO_TOTAL_PEDIDO:
            return {
                precioTotalPedido: action.total
              };

        case usuarioPedidoConstantes.GET_CANTIDAD_ARTICULOS_PEDIDO:
            return {
                cantidadArticulosPedido: action.total
              };
        default:
            return state;
    }
}
