import { BehaviorSubject } from 'rxjs';

import { fetchWrapper, history } from '../components/helpers';

const usuarioPedidoDetalleDetallesSubject = new BehaviorSubject(null);
const baseUrl = `/usuarioPedidoDetalleDetalles`;


export const usuarioPedidosDetalleService = {
    getAll,
    getByIdPedidoDetalle,
    getByIdPedido,
    usuarioPedidoDetalleDetalles: usuarioPedidoDetalleDetallesSubject.asObservable(),
    get usuarioPedidoDetalleDetallesSubjectValue () { return usuarioPedidoDetalleDetallesSubject.value }
};


function getAll() {
    return fetchWrapper.get(`${baseUrl}`);
}

function getByIdPedidoDetalle(idPedidoDetalle) {
    return fetchWrapper.get(`${baseUrl}/${idPedidoDetalle}`);
}

function getByIdPedido(idPedido) {
    return fetchWrapper.get(`${baseUrl}/${idPedido}`);
}

