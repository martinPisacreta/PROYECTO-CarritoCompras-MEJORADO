import { BehaviorSubject } from 'rxjs';

import { fetchWrapper, history } from '../components/helpers';

const usuarioPedidosSubject = new BehaviorSubject(null);
const baseUrl = `/usuarioPedidos`;


export const usuarioPedidosService = {
    getAll,
    getByIdPedido,
    getByIdUsuario,
    getByIdUsuarioNotFinalized,
    create,
    update,
    delete: _delete,
    usuarioPedidos: usuarioPedidosSubject.asObservable(),
    get usuarioPedidosSubjectValue () { return usuarioPedidosSubject.value }
   
};


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

function create(params) {
    return fetchWrapper.post(`${baseUrl}`, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(up => {
            // update stored up if the logged in up updated their own record
            if (up.id === usuarioPedidosSubject.value.id) {
                // publish updated up to subscribers
                up = { ...usuarioPedidosSubject.value, ...up };
                usuarioPedidosSubject.next(up);
            }
            return up;
        });
}

function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
        .then(x => {
            // auto logout if the logged in x deleted their own record
            if (id === usuarioPedidosSubject.value.id) {
                logout();
            }
            return x;
        });
}


