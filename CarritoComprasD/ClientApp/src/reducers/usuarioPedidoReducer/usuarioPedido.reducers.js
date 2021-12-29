import {  usuarioPedidoConstantes } from '../../actions/types';


const initialState = {
    precioTotalPedido: 0,
}

export default function usuarioPedidoReducer( state = initialState, action ) {
    switch ( action.type ) {
        case usuarioPedidoConstantes.GET_PRECIO_TOTAL_PEDIDO:
            return {
                precioTotalPedido: action.total
              };
        default:
            return state;
    }
}
