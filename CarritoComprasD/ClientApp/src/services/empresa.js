
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '@helpers';
const empresaSubject = new BehaviorSubject(null);
const baseUrl = `/empresas`;


export const empresaService = {
    getById,
    empresa: empresaSubject.asObservable(),
    get empresaValue () { return empresaSubject.value }
};


function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}



