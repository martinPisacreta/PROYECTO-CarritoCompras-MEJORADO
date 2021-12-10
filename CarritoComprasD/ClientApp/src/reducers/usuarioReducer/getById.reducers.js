import {  usuarioConstantes } from '../../actions/types';

export default function getByIdReducer(state = {}, action) {
  switch (action.type) {
    case usuarioConstantes.GET_BY_ID_REQUEST:
      return {
        loading: true
      };
    case usuarioConstantes.GET_BY_ID_SUCCESS:
      return {
        usuario: action.usuario
      };
    case usuarioConstantes.GET_BY_ID_FAILURE:
      return { 
        error: action.error
      };
    default:
      return state
  }
}