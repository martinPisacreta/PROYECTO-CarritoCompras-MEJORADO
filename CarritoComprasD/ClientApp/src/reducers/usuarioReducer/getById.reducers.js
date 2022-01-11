import {  usuarioConstantes } from '../../actions/types';


const initialState = {
  loading: false,
  usuario: null,
  error: ''
}


export default function getByIdReducer(state = initialState, action) {
  switch (action.type) {
    case usuarioConstantes.GET_BY_ID_REQUEST:
      return {
        loading: true,
        usuario: null,
        error: ''
      };
    case usuarioConstantes.GET_BY_ID_SUCCESS:
      return {
        loading: false,
        usuario: action.usuario,
        error: ''
      };
    case usuarioConstantes.GET_BY_ID_FAILURE:
      return { 
        loading: false,
        usuario: null,
        error: action.error
      };
    default:
      return state
  }
}