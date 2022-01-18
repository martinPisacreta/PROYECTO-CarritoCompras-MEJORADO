import { marcaConstantes } from './types';
import { marcaService , alertService} from '@services';


export const marcaActions = {
    getAllWithPathImgAndActive,
    loadComboBoxMarca,
    selectedMarca,
    removeSelectedMarca
};


function getAllWithPathImgAndActive() {
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            marcaService.getAllWithPathImgAndActive()
            .then(
                marcas => { 
                    dispatch(success(marcas))
                    resolve(marcas); // respuesta correcta
                },
                error => {
                    alertService.error(error);
                    reject(error)
                }
            )
        })

        
    };

    function request() { return { type: marcaConstantes.GET_BY_FILTERS_REQUEST } }
    function success(marcas) { return { type: marcaConstantes.GET_BY_FILTERS_SUCCESS, marcas } }

}

function loadComboBoxMarca() {
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            marcaService.loadComboBoxMarca()
            .then(
                marcas => { 
                    dispatch(success(marcas))
                    resolve(marcas); // respuesta correcta
                },
                error => {
                    alertService.error(error);
                    reject(error)
                }
            )
        })

        
    };

    function request() { return { type: marcaConstantes.GET_BY_FILTERS_REQUEST } }
    function success(marcas) { return { type: marcaConstantes.GET_BY_FILTERS_SUCCESS, marcas } }

}



function selectedMarca(marca) {
    return dispatch => {
            dispatch(success(marca));  
        }   
    function success(marca) { return { type: marcaConstantes.SELECTED_MARCA_SUCCESS, marca } }
}

function removeSelectedMarca() {
    return dispatch => {
            dispatch(success());  
        }   
    function success() { return { type: marcaConstantes.REMOVE_SELECTED_MARCA_SUCCESS } }
}