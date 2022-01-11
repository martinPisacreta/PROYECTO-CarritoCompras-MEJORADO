import {  usuarioPedidoConstantes } from '../../actions/types';


const initialState = {
    finalizandoPedido: false,
    finalizoPedido: false
}

export default function finalizarPedidoReducer( state = initialState, action ) {
    switch ( action.type ) {
        case usuarioPedidoConstantes.FINALIZAR_PEDIDO_REQUEST:
                return {
                    finalizandoPedido: true,
                    finalizoPedido: false
                };
        case usuarioPedidoConstantes.FINALIZAR_PEDIDO_SUCCESS:
            return {
                finalizandoPedido: false,
                finalizoPedido: true
            };
        case usuarioPedidoConstantes.FINALIZAR_PEDIDO_FAILURE:
            return {
                finalizandoPedido: false,
                finalizoPedido: false
            };
        default:
            return state;
    }
}
