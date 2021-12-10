import { empresaConstantes } from './types';
import { empresaService , alertService  } from '../services';



export const empresaActions = {
    getById
};


function getById(idEmpresa) {

    return dispatch => {
        dispatch(request(idEmpresa));


        return new Promise((resolve, reject) => {
            empresaService.getById(idEmpresa)
                    .then(
                        empresa => { 
                            dispatch(success(empresa))
                            resolve(empresa); // respuesta correcta
                        },
                        error => {
                            dispatch(failure(error.toString()))
                            alertService.error(error);
                            reject(error); // respuesta error
                        }
                        );
                    })
                };
       
    function request(idEmpresa) { return { type: empresaConstantes.GET_BY_ID_REQUEST , idEmpresa } }
    function success(empresa) { return { type: empresaConstantes.GET_BY_ID_SUCCESS, empresa } }
    function failure(error) { return { type: empresaConstantes.GET_BY_ID_FAILURE, error } }
}

