import {  usuarioConstantes } from '@actions/types';




const initialState = {
  loggingIn: false,
  loggedIn : false,
  usuario: null
}

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.LOGIN_REQUEST:
      return {
        loggingIn: true,
        loggedIn: false,
        usuario: null
      };
    case usuarioConstantes.LOGIN_SUCCESS:
      return {
        loggingIn: false,
        loggedIn: true,
        usuario: action.usuario
      };
    default:
      return state
  }
}