import { articuloConstantes } from './types';
import { articuloService , alertService} from '../services';


export const articuloActions = {
    getAll,
    getCount
};


function getAll(page,rowsPerPage,utilidad,filterValue,snOferta) {

    const payload = {
        skip: page,
        take: rowsPerPage,
        utilidad,
        filter: filterValue,
        oferta: snOferta
    };

    
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            articuloService.getAll(payload)
            .then(
                articulos => { 
                    dispatch(success(articulos))
                    resolve(articulos); // respuesta correcta
                },
                error => {
                    dispatch(failure(error.toString()))
                    alertService.error(error);
                    reject(error)
                }
            )
        })

        
    };

    function request() { return { type: articuloConstantes.GETALL_REQUEST } }
    function success(articulos) { return { type: articuloConstantes.GETALL_SUCCESS, articulos } }
    function failure(error) { return { type: articuloConstantes.GETALL_FAILURE, error } }
}

function getCount() {
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            articuloService.getCount()
            .then(
                cantidad => { 
                    dispatch(success(cantidad))
                    resolve(cantidad); // respuesta correcta
                },
                error => {
                    dispatch(failure(error.toString()))
                    alertService.error(error);
                    reject(error)
                }
            )
        })

        
    };

    function request() { return { type: articuloConstantes.GET_COUNT_REQUEST } }
    function success(cantidad) { return { type: articuloConstantes.GET_COUNT_SUCCESS, cantidad } }
    function failure(error) { return { type: articuloConstantes.GET_COUNT_FAILURE, error } }
}
