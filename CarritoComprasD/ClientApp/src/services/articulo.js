
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper, history } from '../components/helpers';
const articuloSubject = new BehaviorSubject(null);
const baseUrl = `/articulos`;


export const articuloService = {
    getByFilters,
    articulo: articuloSubject.asObservable(),
    get articuloValue () { return articuloSubject.value }
};



    


function getByFilters(payload) {
    const skip = parseInt(payload.skip);
    const take = parseInt(payload.take);
    const idTablaMarca = payload.idTablaMarca;
    const idTablaFamilia = payload.idTablaFamilia;
    const codigoArticulo = payload.codigoArticulo;
    const descripcionArticulo  = payload.descripcionArticulo;
    const utilidad = parseInt(payload.utilidad);
    const oferta = payload.oferta;
    return fetchWrapper.post(`${baseUrl}`, {
        skip,
        take,
        idTablaMarca,
        idTablaFamilia,
        codigoArticulo,
        descripcionArticulo,
        utilidad,
        oferta
    });
}
