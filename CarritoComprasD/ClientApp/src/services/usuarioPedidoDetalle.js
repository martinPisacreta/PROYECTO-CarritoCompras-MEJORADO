import { BehaviorSubject } from 'rxjs';

import { fetchWrapper, history } from '../components/helpers';

const usuarioPedidoDetalleDetallesSubject = new BehaviorSubject(null);
const baseUrl = `/usuarioPedidoDetalleDetalles`;


export const usuarioPedidosDetalleService = {
    getAll,
    getByIdPedidoDetalle,
    getByIdPedido,
    create,
    update,
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

function create(params) {
    return fetchWrapper.post(`${baseUrl}`, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(upd => {
            // update stored upd if the logged in upd updated their own record
            if (upd.id === usuarioPedidoDetalleDetallesSubject.value.id) {
                // publish updated upd to subscribers
                upd = { ...usuarioPedidoDetalleDetallesSubject.value, ...upd };
                usuarioPedidoDetalleDetallesSubject.next(upd);
            }
            return upd;
        });
}

