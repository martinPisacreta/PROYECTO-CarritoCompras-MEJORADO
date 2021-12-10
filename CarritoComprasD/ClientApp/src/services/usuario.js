import { BehaviorSubject } from 'rxjs';

import { fetchWrapper, history } from '../components/helpers';

const userSubject = new BehaviorSubject(null);
const baseUrl = `/usuarios`;

export const usuarioService = {
    login,
    logout,
    refreshToken,
    register,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getById,
    update,
    delete: _delete,
    usuario: userSubject.asObservable(),
    get userValue () { return userSubject.value }
};

function login(email, password) {
 
    return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password })
        .then(usuario => {
            //publicar el usuario a los suscriptores e iniciar el temporizador para actualizar el token
            userSubject.next(usuario);
            startRefreshTokenTimer();
            localStorage.setItem('user', JSON.stringify(usuario));
            return usuario;
        });
}

function logout() {
    // revocar el token, detener el temporizador de actualización, publicar nulo para los suscriptores de los usuarios y redirigir a la página de inicio de sesión
    return fetchWrapper.post(`${baseUrl}/revoke-token`,{})
    .then ( mensaje => {
        stopRefreshTokenTimer();
        userSubject.next(null);
        localStorage.removeItem('user');
        return mensaje;
    })
  
}

function refreshToken() {
    return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
        .then(usuario => {
            // publicar el usuario a los suscriptores e iniciar el temporizador para actualizar el token
            userSubject.next(usuario);
            startRefreshTokenTimer();
            return usuario;
        });
}

function register(params) {
    return fetchWrapper.post(`${baseUrl}/register`, params);
}

function verifyEmail(token) {
    return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

function forgotPassword(email) {
    return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

function validateResetToken(token) {
    return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}

function resetPassword(payload ) {
    const token = payload.token;
    const password = payload.password;
    const confirmPassword = payload.confirmacionPassword;
    return fetchWrapper.post(`${baseUrl}/reset-password`, {token,password,confirmPassword} );
}



function getById(id) {
   
    return fetchWrapper.get(`${baseUrl}/${id}`);
}



function update(payload) {
    const {idUsuario , data} = payload;
    return fetchWrapper.put(`${baseUrl}/${idUsuario}`, data)
        .then(usuario => {
            // update stored usuario if the logged in usuario updated their own record
            if (usuario.id === userSubject.value.id) {
                // publish updated usuario to subscribers
                usuario = { ...userSubject.value, ...usuario };
                userSubject.next(usuario);
            }
            return usuario;
        });
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
        .then(x => {
            // auto logout if the logged in usuario deleted their own record
            if (id === userSubject.value.id) {
                logout();
            }
            return x;
        });
}

// helper functions

let refreshTokenTimeout;

function startRefreshTokenTimer() {
    // parse json object from base64 encoded token
    const token = JSON.parse(atob(userSubject.value.token.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(token.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}




