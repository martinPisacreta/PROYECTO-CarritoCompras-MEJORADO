
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper, history } from '../components/helpers';
const marcaSubject = new BehaviorSubject(null);
const baseUrl = `/marcas`;


export const marcaService = {
    getAll,
    getById,
    marca: marcaSubject.asObservable(),
    get marcaValue () { return marcaSubject.value }
};


function getById(id) {
    return fetchWrapper.get(` ${baseUrl}/${id} `);
}

function getAll() {
    return fetchWrapper.get(` ${baseUrl} `);
}

