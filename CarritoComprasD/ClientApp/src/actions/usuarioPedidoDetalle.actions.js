
import { usuarioPedidoDetalleConstantes } from './types';
import { usuarioPedidosService} from '../services';
import {  alertService } from '../services';

export const usuarioPedidoDetalleActions = {
    agregarArticuloPedido,
    eliminarArticuloPedido,
    cambiarCantidadArticuloPedido
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

    function success(articuloAgregado) { return { type: usuarioPedidoDetalleConstantes.AGREGAR_ARTICULO_PEDIDO_SUCCESS,  articuloAgregado } }
}


function eliminarArticuloPedido(articuloId , idUsuario) {

    const payload = {
        articuloId,
        idUsuario
    };


    return dispatch => {
  

    return new Promise((resolve, reject) => {
        usuarioPedidosDetalleService.eliminarArticuloPedido(payload)
                .then(
                    articuloEliminado => { 
                        dispatch( success(payload));
                        alertService.success('Articulo eliminado del carrito');
                        resolve(articuloEliminado); // respuesta correcta
                    },
                    error => {
                        reject(error); // respuesta error
                    })
        })
    };


    function success(payload) { return { type: usuarioPedidoDetalleConstantes.ELIMINAR_ARTICULO_PEDIDO_SUCCESS,  payload } }

}


function cambiarCantidadArticuloPedido( articulo, cantidad , idUsuario) {
    const payload = {
        articulo,
        cantidad,
        idUsuario
    };

    return dispatch => {


    return new Promise((resolve, reject) => {
        usuarioPedidosDetalleService.cambiarCantidadArticuloPedido(payload)
                .then(
                    articuloModificado => { 
                        dispatch( success(articuloId));
                        resolve(articuloModificado); // respuesta correcta
                    },
                    error => {
                       
                        reject(error); // respuesta error
                    })
        })
    };

  
    function success(payload) { return { type: usuarioPedidoDetalleConstantes.CAMBIAR_CANTIDAD_ARTICULO_DE_UN_PEDIDO_SUCCESS,  payload } }

}

