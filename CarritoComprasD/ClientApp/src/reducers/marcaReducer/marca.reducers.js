import {  marcaConstantes } from '../../actions/types';

export default function marcaReducer(state = {}, action) {
  switch (action.type) {
    case marcaConstantes.GET_BY_FILTERS_REQUEST:
      return {
        cargando: true
      };
    case marcaConstantes.GET_BY_FILTERS_SUCCESS:
      return {
        marcas: action.marcas
      };
    case marcaConstantes.GET_BY_FILTERS_FAILURE:
      return { 
        error: action.error
      };
    case marcaConstantes.SELECTED_MARCA_SUCCESS:
        return { 
          marcaSelected: action.pathImgMarca
        };
    case marcaConstantes.REMOVE_SELECTED_MARCA_SUCCESS:
      return { 
        marcaSelected: null
      };
    default:
      return state
  }
}