import {  usuarioConstantes } from '../../actions/types';

let usuario = JSON.parse(localStorage.getItem('user'));


const initialState = {
  loggingIn: false,
  loggedIn : false,
  usuario: null
}

export default function loginLogoutReducer(state = initialState, action) {
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
    case usuarioConstantes.LOGOUT_SUCCESS:
      return {
        loggingIn: false,
        loggedIn: false,
        usuario: null,
      };
    default:
      return state
  }
}