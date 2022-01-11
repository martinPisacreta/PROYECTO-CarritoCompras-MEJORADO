import { familiaConstantes } from './types';
import { familiaService , alertService} from '../services';


export const familiaActions = {
    getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca
};


function getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca(idTablaMarca) {
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            familiaService.getIdTablaFamiliaAndTxtDescFamiliaWithActiveByIdTablaMarca(idTablaMarca)
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

    function request() { return { type: familiaConstantes.GET_BY_FILTERS_REQUEST } }
    function success(familias) { return { type: familiaConstantes.GET_BY_FILTERS_SUCCESS, familias } }

}

