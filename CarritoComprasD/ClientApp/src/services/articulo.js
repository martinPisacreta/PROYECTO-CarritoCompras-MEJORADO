
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper, history } from '../components/helpers';
const articuloSubject = new BehaviorSubject(null);
const baseUrl = `/articulos`;


export const articuloService = {
    getByFilters,
    getCount,
    articulo: articuloSubject.asObservable(),
    get articuloValue () { return articuloSubject.value }
};



function getByFilters(payload) {
    const skip = parseInt(payload.skip);
    const take = parseInt(payload.take);
    const utilidad = parseInt(payload.utilidad);
    const filter = payload.filter;
    const oferta = payload.oferta;
    return fetchWrapper.post(`${baseUrl}`, {
        skip,
        take,
        utilidad,
        filter,
        oferta
    });
}

function getCount() {
    return fetchWrapper.get(`${baseUrl}`);
}
