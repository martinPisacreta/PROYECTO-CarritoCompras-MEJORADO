import {  marcaConstantes } from '../../actions/types';

export default function marcaReducers(state = {}, action) {
  switch (action.type) {
    case marcaConstantes.GETALL_REQUEST:
      return {
        cargando: true
      };
    case marcaConstantes.GETALL_SUCCESS:
      return {
        marcas: action.marcas
      };
    case marcaConstantes.GETALL_FAILURE:
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