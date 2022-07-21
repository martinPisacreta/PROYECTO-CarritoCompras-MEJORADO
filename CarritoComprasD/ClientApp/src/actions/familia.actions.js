import { familiaConstantes } from './types';
import { familiaService , alertService} from '@services';


export const familiaActions = {
    loadComboBoxFamilia,
    loadComboBoxFamiliaByMarca
};


function loadComboBoxFamiliaByMarca(marca) {
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            familiaService.loadComboBoxFamiliaByMarca(marca)
            .then(
                familias => { 
                    dispatch(success(familias))
                    resolve(familias); // respuesta correcta
                },
                error => {
                    alertService.error(error);
                    reject(error)
                }
            )
        })

        
    };

    function request() { return { type: familiaConstantes.GET_BY_MARCA_REQUEST } }
    function success(familias) { return { type: familiaConstantes.GET_BY_MARCA_SUCCESS, familias } }

}

function loadComboBoxFamilia() {
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            familiaService.loadComboBoxFamilia()
            .then(
                familias => { 
                    dispatch(success(familias))
                    resolve(familias); // respuesta correcta
                },
                error => {
                    alertService.error(error);
                    reject(error)
                }
            )
        })

        
    };

    function request() { return { type: familiaConstantes.GET_ALL_ACTIVE_REQUEST } }
    function success(familias) { return { type: familiaConstantes.GET_ALL_ACTIVE_SUCCESS, familias } }

}

