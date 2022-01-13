import {  usuarioPedidoConstantes } from '@actions/types';


const initialState = {
    idUsuario: 0,           //id usuario
    usuarioPedido: null,    //pedido no finalizado del usuario

    totalUsuarioPedidos: 0, //cantidad de pedidos del usuario
    usuarioPedidos: null,    //todos los pedidos del usuario

    totalPedidoDetalles: 0, //cantidad de detalles del pedido
    pedidoDetalles: null    //detalles del pedido
}

export default function usuarioPedidoReducer( state = initialState, action ) {
    switch ( action.type ) {
        case usuarioPedidoConstantes.AGREGAR_ARTICULO_PEDIDO_SUCCESS:
                return {
                    idUsuario: action.articuloAgregado.idUsuario,
                    usuarioPedido: action.articuloAgregado.usuarioPedido,
                };
    
        case usuarioPedidoConstantes.ELIMINAR_ARTICULO_PEDIDO_SUCCESS:
                return {
                    idUsuario: action.articuloEliminado.idUsuario,
                    usuarioPedido: action.articuloEliminado.usuarioPedido,
                };
    
        case usuarioPedidoConstantes.MODIFICAR_ARTICULO_DE_UN_PEDIDO_SUCCESS:
                return {
                    idUsuario: action.articuloModificado.idUsuario,
                    usuarioPedido: action.articuloModificado.usuarioPedido,
                };
        case usuarioPedidoConstantes.GET_PEDIDO_BY_ID_USUARIO_NOT_FINALIZED_SUCCESS:
                return {
                    idUsuario: action.payload.idUsuario,
                    usuarioPedido: action.payload.usuarioPedido,
                }; 
        case usuarioPedidoConstantes.GET_PEDIDOS_BY_ID_USUARIO_SUCCESS:
            return {
                totalUsuarioPedidos: action.total,
                usuarioPedidos: action.usuarioPedidos,
            };   
        case usuarioPedidoConstantes.GET_PEDIDO_DETALLES_BY_ID_USUARIO_PEDIDO_SUCCESS:
            return {
                totalPedidoDetalles: action.total,
                pedidoDetalles: action.usuarioPedidoDetalles,
            };   
        
        default:
            return state;
    }
}
