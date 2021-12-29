import { marcaConstantes } from './types';
import { marcaService , alertService} from '../services';


export const marcaActions = {
    getAll,
    selectedMarca,
    removeSelectedMarca
};


function getAll() {
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            marcaService.getAll()
            .then(
                marcas => { 
                    dispatch(success(marcas))
                    resolve(marcas); // respuesta correcta
                },
                error => {
                    dispatch(failure(error.toString()))
                    alertService.error(error);
                    reject(error)
                }
            )
        })

        
    };

    function request() { return { type: marcaConstantes.GET_BY_FILTERS_REQUEST } }
    function success(marcas) { return { type: marcaConstantes.GET_BY_FILTERS_SUCCESS, marcas } }
    function failure(error) { return { type: marcaConstantes.GET_BY_FILTERS_FAILURE, error } }
}


function selectedMarca(pathImgMarca) {
    return dispatch => {
            dispatch(success(pathImgMarca));  
        }   
    function success(pathImgMarca) { return { type: marcaConstantes.SELECTED_MARCA_SUCCESS, pathImgMarca } }
}

function removeSelectedMarca() {
    return dispatch => {
            dispatch(success());  
        }   
    function success() { return { type: marcaConstantes.REMOVE_SELECTED_MARCA_SUCCESS } }
}