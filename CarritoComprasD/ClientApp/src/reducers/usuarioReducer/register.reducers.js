import {  usuarioConstantes } from '../../actions/types';

export default function registerReducer(state = {}, action) {
  switch (action.type) {
    case usuarioConstantes.REGISTER_REQUEST:
      return {
        registrando : true,
        usuario: action.usuario
      };
    case usuarioConstantes.REGISTER_SUCCESS:
      return {

      };
    case usuarioConstantes.REGISTER_FAILURE:
      return {
        
      };
    default:
      return state
  }
}