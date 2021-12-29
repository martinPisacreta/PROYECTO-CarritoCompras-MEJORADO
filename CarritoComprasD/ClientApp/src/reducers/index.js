
import { combineReducers } from "redux";

import alertaReducer from "./alertReducer/alert.reducers";

import loginLogoutReducer from "./usuarioReducer/loginLogout.reducers";
import registerReducer from "./usuarioReducer/register.reducers";
import verifyEmailReducer from "./usuarioReducer/verifyEmail.reducers";
import forgotPasswordReducer from "./usuarioReducer/forgotPassword.reducers"
import validateResetToken from "./usuarioReducer/validateResetToken.reducers"
import resetPassword from "./usuarioReducer/resetPassword.reducers"
import getByIdReducer from "./usuarioReducer/getById.reducers"
import updateReducer from "./usuarioReducer/update.reducers"

import usuarioPedidoDetalleReducer from "./usuarioPedidoDetalleReducer/usuarioPedidoDetalle.reducers"
import usuarioPedidoReducer from "./usuarioPedidoReducer/usuarioPedido.reducers"
import marcaReducer from "./marcaReducer/marca.reducers.js"
import empresaReducer from "./empresaReducer/empresa.reducers.js"
import articuloReducer from "./articuloReducer/articulo.reducers.js"

export default combineReducers({
    alertaReducer,
    loginLogoutReducer,
    registerReducer,
    verifyEmailReducer,
    forgotPasswordReducer,
    validateResetToken,
    resetPassword,
    getByIdReducer,
    updateReducer,
    usuarioPedidoReducer,
    usuarioPedidoDetalleReducer,
    marcaReducer,
    empresaReducer,
    articuloReducer
});