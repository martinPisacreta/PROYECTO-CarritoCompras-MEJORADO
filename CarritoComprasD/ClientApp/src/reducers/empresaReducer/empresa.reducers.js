import {  empresaConstantes } from '../../actions/types';

const initialState = {
  loading: false,
  empresa: null,
  error: ''
}


export default function empresaReducer(state = initialState, action) {
  switch (action.type) {
    case empresaConstantes.GET_BY_ID_REQUEST:
      return {
        loading: true,
        empresa: null,
        error: ''
      };
    case empresaConstantes.GET_BY_ID_SUCCESS:
      return {
        loading: false,
        empresa: action.empresa,
        error: ''
      };
    case empresaConstantes.GET_BY_ID_FAILURE:
      return { 
        loading: false,
        empresa: null,
        error: action.error
        
      };
    default:
      return state
  }
}