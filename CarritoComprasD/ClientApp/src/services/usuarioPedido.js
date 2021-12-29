import { BehaviorSubject } from 'rxjs';

import { fetchWrapper, history } from '../components/helpers';

const usuarioPedidosSubject = new BehaviorSubject(null);
const baseUrl = `/usuarioPedidos`;


export const usuarioPedidosService = {
    agregarArticuloPedido,
    getAll,
    getByIdPedido,
    getByIdUsuario,
    getByIdUsuarioNotFinalized,
    finalizarPedido, //tengo que hacer este metodo en vs 2019
    usuarioPedidos: usuarioPedidosSubject.asObservable(),
    get usuarioPedidosSubjectValue () { return usuarioPedidosSubject.value }
   
};

function agregarArticuloPedido(params) {
    return fetchWrapper.post(`${baseUrl}/agregar-articulo-pedido`, params);
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}`);
}


function getByIdPedido(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}


function getByIdUsuario(idUsuario) {
    return fetchWrapper.get(`${baseUrl}/${idUsuario}`);
}

function getByIdUsuarioNotFinalized (idUsuario) {
    return fetchWrapper.get(`${baseUrl}/get-by-idUsuario-not-finalized/${idUsuario}`);
}

 //tengo que hacer este metodo en vs 2019
function finalizarPedido(params) {
    return fetchWrapper.post(`${baseUrl}`, params);
}








