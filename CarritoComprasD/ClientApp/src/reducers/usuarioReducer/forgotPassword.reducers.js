import {  usuarioConstantes } from '../../actions/types';

const initialState = {
  email: ''
}


export default function forgotPasswordReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.FORGOT_PASSWORD_REQUEST:
      return {
        email : action.email
      };
    case usuarioConstantes.FORGOT_PASSWORD_SUCCESS:
      return {
        email: ''
      };
    case usuarioConstantes.FORGOT_PASSWORD_FAILURE:
      return {
        email: ''
      };
    default:
      return state
  }
}
