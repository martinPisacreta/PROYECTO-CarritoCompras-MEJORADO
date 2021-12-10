import {  usuarioConstantes } from '../../actions/types';

let usuario = JSON.parse(localStorage.getItem('user'));
const initialState = usuario ? { loggedIn: true,  usuario } : {};

export default function loginLogoutReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.LOGIN_REQUEST:
      return {
        loggingIn: true,
        usuario: action.email
      };
    case usuarioConstantes.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        usuario: action.email
      };
    case usuarioConstantes.LOGIN_FAILURE:
      return {

      };
    case usuarioConstantes.LOGOUT:
      return {
        mensaje: action.mensaje,
        loggedIn: false,
        usuario: null,
      };
    default:
      return state
  }
}