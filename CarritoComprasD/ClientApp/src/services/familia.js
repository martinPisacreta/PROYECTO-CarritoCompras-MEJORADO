
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '@helpers';
const familiaSubject = new BehaviorSubject(null);
const baseUrl = `/familias`;


export const familiaService = {
    getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca,
    familia: familiaSubject.asObservable(),
    get familiaValue () { return familiaSubject.value }
};


function getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca(idTablaMarca) {
    return fetchWrapper.get(` ${baseUrl}/${idTablaMarca}`);
}

