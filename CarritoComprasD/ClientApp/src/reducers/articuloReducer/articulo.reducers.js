import {   articuloConstantes } from '../../actions/types';

export default function articuloReducer(state = {}, action) {
  switch (action.type) {
    case articuloConstantes.GET_BY_FILTERS_REQUEST:
      return {
        cargando: true
      };
    case articuloConstantes.GET_BY_FILTERS_SUCCESS:
      return {
        articulos: action.articulos
      };
    case articuloConstantes.GET_BY_FILTERS_FAILURE:
      return { 
        error: action.error
      };

      
    case articuloConstantes.GET_COUNT_REQUEST:
      return {
        cargando: true
      };
    case articuloConstantes.GET_COUNT_REQUEST:
      return {
        cantidad: action.cantidad
      };
    case articuloConstantes.GET_COUNT_FAILURE:
      return { 
        error: action.error
      };
    default:
      return state
  }
}