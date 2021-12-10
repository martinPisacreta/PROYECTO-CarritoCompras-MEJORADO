
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper, history } from '../components/helpers';
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



