import {  usuarioConstantes } from '../../actions/types';

export default function updateReducer(state = {}, action) {
  switch (action.type) {
    case usuarioConstantes.UPDATE_REQUEST:
      return {
        updating : true,
        usuario: action.payload.data
      };
    case usuarioConstantes.UPDATE_SUCCESS:
      return {
        usuario: action.usuario
      };
    case usuarioConstantes.UPDATE_FAILURE:
      return {
        
      };
    default:
      return state
  }
}