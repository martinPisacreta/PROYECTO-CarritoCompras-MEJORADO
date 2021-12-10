import {  usuarioConstantes } from '../../actions/types';

export default function verifyEmailReducer(state = {}, action) {
  switch (action.type) {
    case usuarioConstantes.VALIDATE_RESET_TOKEN_REQUEST:
      return {
        validando : true,
        token: action.token
      };
    case usuarioConstantes.VALIDATE_RESET_TOKEN_SUCCESS:
      return {

      };
    case usuarioConstantes.VERIFY_EMAIL_FAILURE:
      return {
        
      };
    default:
      return state
  }
}
