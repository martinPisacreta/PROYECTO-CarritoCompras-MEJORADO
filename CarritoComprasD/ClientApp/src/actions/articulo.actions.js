import { articuloConstantes } from './types';
import { articuloService , alertService} from '@services';


export const articuloActions = {
    getByFilters
};


function getByFilters(page,rowsPerPage,marcaSeleccionadaComboBox,familiaSeleccionadaComboBox,codigoArticulo,descripcionArticulo,utilidad,snOferta) {
    const payload = {
        skip: page,
        take: rowsPerPage,
        idTablaMarca : marcaSeleccionadaComboBox ? marcaSeleccionadaComboBox.id : 0,
        idTablaFamilia : familiaSeleccionadaComboBox ? familiaSeleccionadaComboBox.id : 0,
        codigoArticulo : codigoArticulo ? codigoArticulo : "",
        descripcionArticulo : descripcionArticulo ? descripcionArticulo : '',
        utilidad,
        oferta: snOferta
    };


    
    return dispatch => {
        dispatch(request());

        return new Promise((resolve, reject) => {
            articuloService.getByFilters(payload)
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

    function request() { return { type: articuloConstantes.GET_BY_FILTERS_REQUEST } }
    function success(articulos) { return { type: articuloConstantes.GET_BY_FILTERS_SUCCESS, articulos } }
    function failure(error) { return { type: articuloConstantes.GET_BY_FILTERS_FAILURE, error } }
}

