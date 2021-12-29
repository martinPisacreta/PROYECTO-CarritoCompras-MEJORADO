
import { usuarioPedidoConstantes } from './types';
import { usuarioPedidosService } from '../services';

export const usuarioPedidoActions = {
    getCantidadArticulosPedido,
    finalizarPedido
};









function getCantidadArticulosPedido(usuarioPedidoDetalles) {
    return dispatch => {
        let total = 0;

        for ( let i = 0; i < usuarioPedidoDetalles.length; i++ ) {
            total += parseInt( usuarioPedidoDetalles[i].cantidad, 10 );
        }
       
        dispatch( success(total));
    };

    function success(total) { return { type: usuarioPedidoConstantes.GET_CANTIDAD_ARTICULOS_PEDIDO,  total } } 
}

function finalizarPedido(pedido) {
    return dispatch => {
        dispatch(request(pedido));

        return new Promise((resolve, reject) => {
            usuarioPedidosService.finalizarPedido(pedido)
                    .then(
                        _pedido => { 
                            dispatch(success());
                            
                            alertService.success('Pedido finalizado correctamente');
                            setTimeout(() => {
                                history.push('/');
                              }, 3000);
                            resolve(_pedido); // respuesta correcta
                        },
                        error => {
                            dispatch(failure());
                            alertService.error(error);
                            reject(error); // respuesta error
                        }
                    );
                })
            };
        
      

    function request(pedido) { return { type: usuarioPedidoConstantes.CREAR_PEDIDO_REQUEST,  pedido } }
    function success() { return { type: usuarioPedidoConstantes.CREAR_PEDIDO_SUCCESS } }
    function failure() { return { type: usuarioPedidoConstantes.CREAR_PEDIDO_FAILURE } }
}


