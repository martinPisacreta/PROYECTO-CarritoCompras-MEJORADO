import {  usuarioConstantes } from '@actions/types';

const initialState = {
  updating: false,
  usuario: null
}



export default function updateReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.UPDATE_REQUEST:
      return {
        updating: true,
        usuario: null
      };
    case usuarioConstantes.UPDATE_SUCCESS:
      return {

        updating: false,
        usuario: action.usuario
      };
    case usuarioConstantes.UPDATE_FAILURE:
      return {
        updating: false,
        usuario: null
      };
    default:
      return state
  }
}