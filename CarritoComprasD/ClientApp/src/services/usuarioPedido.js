import { BehaviorSubject } from 'rxjs';

import { fetchWrapper } from '@helpers';

const usuarioPedidosSubject = new BehaviorSubject(null);
const baseUrl = `/usuarioPedidos`;


export const usuarioPedidosService = {
    agregarArticuloPedido,
    eliminarArticuloPedido,
    modificarArticuloPedido,
    getPedidoByIdUsuarioNotFinalized,
    finalizarPedido,
    getPedidosByIdUsuario,
    getPedidoDetallesByIdUsuarioPedido,
    usuarioPedidos: usuarioPedidosSubject.asObservable(),
    get usuarioPedidosSubjectValue () { return usuarioPedidosSubject.value }
   
};

function agregarArticuloPedido(params) {
    return fetchWrapper.post(`${baseUrl}/agregar-articulo-pedido`, params);
}

function eliminarArticuloPedido(params) {
    return fetchWrapper.post(`${baseUrl}/eliminar-articulo-pedido`, params);
}

function modificarArticuloPedido(params) {
    return fetchWrapper.post(`${baseUrl}/modificar-articulo-pedido`, params);
}





function getPedidoByIdUsuarioNotFinalized (idUsuario) {
    return fetchWrapper.get(`${baseUrl}/get-by-idUsuario-not-finalized/${idUsuario}`);
}

 //tengo que hacer este metodo en vs 2019
function finalizarPedido(params) {
    return fetchWrapper.post(`${baseUrl}/finalizar-pedido`, params);
}

function getPedidosByIdUsuario(params) {
    console.log(params)
    return fetchWrapper.post(`${baseUrl}/get-pedidos-by-idUsuario`, params );
}

function getPedidoDetallesByIdUsuarioPedido(params) {
    console.log(params)
    return fetchWrapper.post(`${baseUrl}/get-pedidoDetalles-by-idUsuarioPedido`, params );
}








