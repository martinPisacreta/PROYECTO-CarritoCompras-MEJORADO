import {  usuarioConstantes } from '../../actions/types';


const initialState = {
  validando: false,
  token: ''
}


export default function verifyEmailReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.VALIDATE_RESET_TOKEN_REQUEST:
      return {
        validando : true,
        token: action.token
      };
    case usuarioConstantes.VALIDATE_RESET_TOKEN_SUCCESS:
      return {
        validando: false,
        token: ''
      };
    case usuarioConstantes.VERIFY_EMAIL_FAILURE:
      return {
        validando: false,
        token: ''
      };
    default:
      return state
  }
}
