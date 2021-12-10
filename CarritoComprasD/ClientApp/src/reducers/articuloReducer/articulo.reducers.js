import {   articuloConstantes } from '../../actions/types';

export default function articuloReducers(state = {}, action) {
  switch (action.type) {
    case articuloConstantes.GETALL_REQUEST:
      return {
        cargando: true
      };
    case articuloConstantes.GETALL_SUCCESS:
      return {
        articulos: action.articulos
      };
    case articuloConstantes.GETALL_FAILURE:
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