import {  usuarioConstantes } from '@actions/types';


const initialState = {
  verificando: false,
  token: ''
}


export default function verifyEmailReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.VERIFY_EMAIL_REQUEST:
      return {
        verificando : true,
        token: action.token
      };
    case usuarioConstantes.VERIFY_EMAIL_SUCCESS:
      return {
        verificando: false,
        token: ''
      };
    case usuarioConstantes.VERIFY_EMAIL_FAILURE:
      return {
        verificando: false,
        token: ''
      };
    default:
      return state
  }
}
