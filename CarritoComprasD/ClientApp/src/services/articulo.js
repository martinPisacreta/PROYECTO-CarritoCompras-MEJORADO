
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '@helpers';
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
    const comboBoxMarca = payload.comboBoxMarca;
    const comboBoxFamilia = payload.comboBoxFamilia;
    const codigoArticulo = payload.codigoArticulo;
    const descripcionArticulo  = payload.descripcionArticulo;
    const utilidad = parseInt(payload.utilidad);
    const oferta = payload.oferta;
    return fetchWrapper.post(`${baseUrl}`, {
        skip,
        take,
        comboBoxMarca,
        comboBoxFamilia,
        codigoArticulo,
        descripcionArticulo,
        utilidad,
        oferta
    });
}
