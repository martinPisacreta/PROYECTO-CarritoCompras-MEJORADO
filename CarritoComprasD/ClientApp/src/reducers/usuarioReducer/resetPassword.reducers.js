import {  usuarioConstantes } from '../../actions/types';

export default function verifyEmailReducer(state = {}, action) {
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
        payload: [
          action.payload.token,
          action.payload.password,
          action.payload.confirmacionPassword
        ]
      };
    case usuarioConstantes.RESET_PASSWORD_FAILURE:
      return {};
    default:
      return state
  }
}
