
import { usuarioPedidoDetalleConstantes } from './types';
import { usuarioPedidosDetalleService} from '../services';
import { toast } from 'react-toastify';

export const usuarioPedidoDetalleActions = {
    agregarArticulo,
    eliminarArticulo,
    cambiarCantidadArticulo
};




function agregarArticulo( articulo, cantidad) {
    const payload = {
        articulo,
        cantidad
    };

    return dispatch => {

    return new Promise((resolve, reject) => {
        usuarioPedidosDetalleService.agregarArticulo(payload)
                .then(
                    articuloAgregado => { 
                        dispatch( success(payload));
                        toast.success( "Articulo agregado al carrito" );
                        resolve(articuloAgregado); // respuesta correcta
                    },
                    error => {
                        reject(error); // respuesta error
                    })
        })
    };

    function success(payload) { return { type: types.AGREGAR_ARTICULO_SUCCESS,  payload } }
}


function eliminarArticulo(articuloId) {
    return dispatch => {
  

    return new Promise((resolve, reject) => {
        usuarioPedidosDetalleService.eliminarArticulo(articuloId)
                .then(
                    articuloEliminado => { 
                        dispatch( success(articuloId));
                        toast.error( "Articulo eliminado del carrito" );
                        resolve(articuloEliminado); // respuesta correcta
                    },
                    error => {
                        reject(error); // respuesta error
                    })
        })
    };


    function success(articuloId) { return { type: usuarioPedidoDetalleConstantes.ELIMINAR_ARTICULO_SUCCESS,  articuloId } }

}


function cambiarCantidadArticulo( articulo, cantidad) {
    const payload = {
        articulo,
        cantidad
    };

    return dispatch => {


    return new Promise((resolve, reject) => {
        usuarioPedidosDetalleService.cambiarCantidadArticulo(payload)
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

  
    function success(payload) { return { type: usuarioPedidoDetalleConstantes.CAMBIAR_CANTIDAD_ARTICULO_SUCCESS,  payload } }

}

