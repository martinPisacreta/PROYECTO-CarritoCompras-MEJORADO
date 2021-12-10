import {  usuarioConstantes } from '../../actions/types';

export default function verifyEmailReducer(state = {}, action) {
  switch (action.type) {
    case usuarioConstantes.VERIFY_EMAIL_REQUEST:
      return {
        verificando : true,
        usuario: action.token
      };
    case usuarioConstantes.VERIFY_EMAIL_SUCCESS:
      return {

      };
    case usuarioConstantes.VERIFY_EMAIL_FAILURE:
      return {
        
      };
    default:
      return state
  }
}
