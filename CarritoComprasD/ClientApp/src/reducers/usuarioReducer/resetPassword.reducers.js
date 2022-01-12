import {  usuarioConstantes } from '@actions/types';

const initialState = {
  reseteando: false,
  payload: null
}


export default function verifyEmailReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.RESET_PASSWORD_REQUEST:
      return {
        reseteando : true,
        payload: [
          action.payload.token,
          action.payload.password,
          action.payload.confirmacionPassword
        ]
      };
    case usuarioConstantes.RESET_PASSWORD_SUCCESS:
      return {
        reseteando: false,
        payload: [
          action.payload.token,
          action.payload.password,
          action.payload.confirmacionPassword
        ]
      };
    case usuarioConstantes.RESET_PASSWORD_FAILURE:
      return {
        reseteando: false,
        payload: []
      };
    default:
      return state
  }
}
