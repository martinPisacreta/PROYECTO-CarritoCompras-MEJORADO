
import { usuarioPedidoConstantes } from './types';
import { usuarioPedidosService } from '../services';

export const usuarioPedidoActions = {
    finalizarPedido,
    getByIdUsuarioNotFinalized,
    agregarArticuloPedido,
    eliminarArticuloPedido,
    modificarArticuloPedido
};


function agregarArticuloPedido( articulo, cantidad , idUsuario , idEmpresa , utilidad) {
    const payload = {
        articulo,
        cantidad,
        idUsuario,
        idEmpresa,
        utilidad
    };

   
    return dispatch => {

    return new Promise((resolve, reject) => {
        usuarioPedidosService.agregarArticuloPedido(payload)
                .then(
                    articuloAgregado => { 

                        dispatch( success(articuloAgregado));
                        alertService.success('Articulo agregado al carrito');
                        resolve(articuloAgregado); // respuesta correcta
                    },
                    error => {
                        reject(error); // respuesta error
                    })
        })
    };

    function success(articuloAgregado) { return { type: usuarioPedidoConstantes.AGREGAR_ARTICULO_PEDIDO_SUCCESS,  articuloAgregado } }
}


function eliminarArticuloPedido(idUsuario, idArticulo) {

    const payload = {
        idUsuario,
        idArticulo
    };


    return dispatch => {
  

    return new Promise((resolve, reject) => {
        usuarioPedidosService.eliminarArticuloPedido(payload)
                .then(
                    articuloEliminado => { 
                        dispatch( success(articuloEliminado));
                        alertService.success('Articulo eliminado del carrito');
                        resolve(articuloEliminado); // respuesta correcta
                    },
                    error => {
                        reject(error); // respuesta error
                    })
        })
    };


    function success(articuloEliminado) { return { type: usuarioPedidoConstantes.ELIMINAR_ARTICULO_PEDIDO_SUCCESS,  articuloEliminado } }

}


function modificarArticuloPedido( idUsuario,idArticulo, cantidad) {
    const payload = {
        idUsuario,
        idArticulo,
        cantidad
    };

    return dispatch => {


    return new Promise((resolve, reject) => {
        usuarioPedidosService.modificarArticuloPedido(payload)
                .then(
                    articuloModificado => { 
                        dispatch( success(articuloModificado));
                        resolve(articuloModificado); // respuesta correcta
                    },
                    error => {
                       
                        reject(error); // respuesta error
                    })
        })
    };

  
    function success(articuloModificado) { return { type: usuarioPedidoConstantes.MODIFICAR_ARTICULO_DE_UN_PEDIDO_SUCCESS,  articuloModificado } }

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


function getByIdUsuarioNotFinalized( idUsuario ) {

    return dispatch => {

    return new Promise((resolve, reject) => {
        usuarioPedidosService.getByIdUsuarioNotFinalized(idUsuario)
                .then(
                    usuarioPedido => { 

                        const payload = {
                            usuarioPedido,
                            idUsuario
                        };

                        dispatch( success(payload));
                        resolve(payload); // respuesta correcta
                    },
                    error => {
                        reject(error); // respuesta error
                    })
        })
    };

    function success(payload) { return { type: usuarioPedidoConstantes.GET_BY_ID_USUARIO_NOT_FINALIZED_SUCCESS,  payload } }
}