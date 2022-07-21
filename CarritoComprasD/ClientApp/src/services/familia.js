
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '@helpers';
const familiaSubject = new BehaviorSubject(null);
const baseUrl = `/familias`;


export const familiaService = {
    loadComboBoxFamilia,
    loadComboBoxFamiliaByMarca,
    familia: familiaSubject.asObservable(),
    get familiaValue () { return familiaSubject.value }
};


function loadComboBoxFamiliaByMarca(marca) {

    const {descripcionMarca , list_IdTablaMarca} = marca;
    return fetchWrapper.post(`${baseUrl}`, {
        descripcionMarca,
        list_IdTablaMarca
    });
}



function loadComboBoxFamilia() {
    return fetchWrapper.get(` ${baseUrl}`);
}