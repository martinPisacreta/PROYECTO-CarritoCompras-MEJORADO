import {  usuarioConstantes } from '../../actions/types';

export default function forgotPasswordReducer(state = {}, action) {
  switch (action.type) {
    case usuarioConstantes.FORGOT_PASSWORD_REQUEST:
      return {
        email : action.email
      };
    case usuarioConstantes.FORGOT_PASSWORD_SUCCESS:
      return {

      };
    case usuarioConstantes.FORGOT_PASSWORD_FAILURE:
      return {
        
      };
    default:
      return state
  }
}
