import {   articuloConstantes } from '@actions/types';


const initialState = {
  cargando: false,
  articulos: null,
  error : ''
}


export default function articuloReducer(state = initialState, action) {
  switch (action.type) {
    case articuloConstantes.GET_BY_FILTERS_REQUEST:
      return {
        cargando: true,
        articulos: null,
        error: ''
      };
    case articuloConstantes.GET_BY_FILTERS_SUCCESS:
      return {
        cargando: false,
        articulos: action.articulos,
        error: ''
      };
    case articuloConstantes.GET_BY_FILTERS_FAILURE:
      return { 
        cargando: false,
        articulos: null,
        error: action.error
      };
    default:
      return state
  }
}