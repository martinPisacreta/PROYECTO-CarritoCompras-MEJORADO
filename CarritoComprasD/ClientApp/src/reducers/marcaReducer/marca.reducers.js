import {  marcaConstantes } from '@actions/types';


const initialState = {
  cargando: false,
  marcas: null,
  marcaSelected: null
}


export default function marcaReducer(state = initialState, action) {
  switch (action.type) {
    case marcaConstantes.GET_ALL_WITH_PATH_IMG_AND_ACTIVE_REQUEST:
      return {
        cargando: true
      };
    case marcaConstantes.GET_ALL_WITH_PATH_IMG_AND_ACTIVE_SUCCESS:
      return {
        marcas: action.marcas
      };
    case marcaConstantes.GET_BY_FAMILIA_REQUEST:
      return {
        cargando: true
      };
    case marcaConstantes.GET_BY_FAMILIA_SUCCESS:
      return {
        marcas: action.marcas
      };
    case marcaConstantes.SELECTED_MARCA_SUCCESS:
        return { 
          marcaSelected: action.marca
        };
    case marcaConstantes.REMOVE_SELECTED_MARCA_SUCCESS:
      return { 
        marcaSelected: null
      };
    default:
      return state
  }
}