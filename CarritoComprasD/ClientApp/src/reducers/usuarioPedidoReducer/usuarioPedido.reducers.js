import {  usuarioPedidoConstantes } from '../../actions/types';


const initialState = {
    idUsuario: 0,
    usuarioPedido: {}
}

export default function usuarioPedidoReducer( state = initialState, action ) {
    switch ( action.type ) {
        case usuarioPedidoConstantes.AGREGAR_ARTICULO_PEDIDO_SUCCESS:
                return {
                   
                    idUsuario: action.articuloAgregado.idUsuario,
                    usuarioPedido: action.articuloAgregado.usuarioPedido
                };
    
        case usuarioPedidoConstantes.ELIMINAR_ARTICULO_PEDIDO_SUCCESS:
                return {
                    idUsuario: action.articuloEliminado.idUsuario,
                    usuarioPedido: action.articuloEliminado.usuarioPedido
                };
    
        case usuarioPedidoConstantes.MODIFICAR_ARTICULO_DE_UN_PEDIDO_SUCCESS:
                return {
                    idUsuario: action.articuloModificado.idUsuario,
                    usuarioPedido: action.articuloModificado.usuarioPedido
                };
        case usuarioPedidoConstantes.GET_BY_ID_USUARIO_NOT_FINALIZED_SUCCESS:
                return {
                    idUsuario: action.payload.idUsuario,
                    usuarioPedido: action.payload.usuarioPedido
                };
        default:
            return state;
    }
}
