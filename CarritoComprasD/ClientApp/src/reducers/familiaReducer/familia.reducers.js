import {   familiaConstantes } from '@actions/types';


const initialState = {
  cargando: false,
  familias: null,
}


export default function familiaReducer(state = initialState, action) {
  switch (action.type) {
    case familiaConstantes.GET_ALL_ACTIVE_REQUEST:
        return {
          cargando: true
        };
    case familiaConstantes.GET_ALL_ACTIVE_SUCCESS:
        return {
          familias: action.familias
        };
    case familiaConstantes.GET_BY_MARCA_REQUEST:
      return {
        cargando: true
      };
    case familiaConstantes.GET_BY_MARCA_SUCCESS:
      return {
        familias: action.familias
      };
    default:
      return state
  }
}