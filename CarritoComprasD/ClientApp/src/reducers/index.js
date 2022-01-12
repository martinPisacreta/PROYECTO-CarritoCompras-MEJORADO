
import { combineReducers } from "redux";

import alertaReducer from "./alertReducer/alert.reducers";

import loginReducer from "./usuarioReducer/loginReducer.reducers";
import registerReducer from "./usuarioReducer/register.reducers";
import verifyEmailReducer from "./usuarioReducer/verifyEmail.reducers";
import forgotPasswordReducer from "./usuarioReducer/forgotPassword.reducers"
import validateResetToken from "./usuarioReducer/validateResetToken.reducers"
import resetPassword from "./usuarioReducer/resetPassword.reducers"
import getByIdReducer from "./usuarioReducer/getById.reducers"
import updateReducer from "./usuarioReducer/update.reducers"

import usuarioPedidoReducer from "./usuarioPedidoReducer/usuarioPedido.reducers"
import finalizarPedidoReducer from "./usuarioPedidoReducer/finalizarPedido.reducers"
import marcaReducer from "./marcaReducer/marca.reducers.js"
import familiaReducer from "./familiaReducer/familia.reducers.js"
import empresaReducer from "./empresaReducer/empresa.reducers.js"
import articuloReducer from "./articuloReducer/articulo.reducers.js"

export default combineReducers({
    alertaReducer,
    loginReducer,
    registerReducer,
    verifyEmailReducer,
    forgotPasswordReducer,
    validateResetToken,
    resetPassword,
    getByIdReducer,
    updateReducer,
    usuarioPedidoReducer,
    finalizarPedidoReducer,
    marcaReducer,
    familiaReducer,
    empresaReducer,
    articuloReducer
});