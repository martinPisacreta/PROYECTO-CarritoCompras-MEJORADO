import {  usuarioConstantes } from '@actions/types';

const initialState = {
  registrando : false,
  usuario: null
}


export default function registerReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.REGISTER_REQUEST:
      return {
        registrando : true,
        usuario: action.usuario
      };
    case usuarioConstantes.REGISTER_SUCCESS:
      return {
        registrando: false,
        usuario: action.usuario
      };
    case usuarioConstantes.REGISTER_FAILURE:
      return {
        registrando: false,
        usuario: null
      };
    default:
      return state
  }
}