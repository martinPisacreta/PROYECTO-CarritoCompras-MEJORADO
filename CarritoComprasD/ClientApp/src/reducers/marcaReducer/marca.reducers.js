import {  marcaConstantes } from '../../actions/types';


const initialState = {
  cargando: false,
  marcas: {},
  marcaSelected: ''
}


export default function marcaReducer(state = initialState, action) {
  switch (action.type) {
    case marcaConstantes.GET_BY_FILTERS_REQUEST:
      return {
        cargando: true
      };
    case marcaConstantes.GET_BY_FILTERS_SUCCESS:
      return {
        marcas: action.marcas
      };
    case marcaConstantes.SELECTED_MARCA_SUCCESS:
        return { 
          marcaSelected: action.pathImgMarca
        };
    case marcaConstantes.REMOVE_SELECTED_MARCA_SUCCESS:
      return { 
        marcaSelected: ''
      };
    default:
      return state
  }
}