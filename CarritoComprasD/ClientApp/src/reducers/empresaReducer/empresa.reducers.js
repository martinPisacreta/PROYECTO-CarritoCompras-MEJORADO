import {  empresaConstantes } from '../../actions/types';

export default function empresaReducer(state = {}, action) {
  switch (action.type) {
    case empresaConstantes.GET_BY_ID_REQUEST:
      return {
        loading: true
      };
    case empresaConstantes.GET_BY_ID_SUCCESS:
      return {
        empresa: action.empresa
      };
    case empresaConstantes.GET_BY_ID_FAILURE:
      return { 
        error: action.error
      };
    default:
      return state
  }
}