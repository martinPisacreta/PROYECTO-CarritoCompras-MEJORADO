
import { BehaviorSubject } from 'rxjs';
import { fetchWrapper } from '@helpers';
const marcaSubject = new BehaviorSubject(null);
const baseUrl = `/marcas`;


export const marcaService = {
    getAllWithPathImgAndActive,
    getIdTablaMarcaAndTxtDescMarcaWithActive,
    getById,
    marca: marcaSubject.asObservable(),
    get marcaValue () { return marcaSubject.value }
};


function getById(id) {
    return fetchWrapper.get(` ${baseUrl}/${id} `);
}

function getAllWithPathImgAndActive() {
    return fetchWrapper.get(` ${baseUrl}/get-all-with-pathImg-and-active`);
}

function getIdTablaMarcaAndTxtDescMarcaWithActive() {
    return fetchWrapper.get(` ${baseUrl}/get-idTablaMarca-and-txtDescMarca-with-active`);
}

