
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '@helpers';
const familiaSubject = new BehaviorSubject(null);
const baseUrl = `/familias`;


export const familiaService = {
    loadComboBoxFamilia,
    familia: familiaSubject.asObservable(),
    get familiaValue () { return familiaSubject.value }
};


function loadComboBoxFamilia(marca) {
    const {label , campo} = marca;
    return fetchWrapper.post(`${baseUrl}`, {
        label,
        campo
    });
}

