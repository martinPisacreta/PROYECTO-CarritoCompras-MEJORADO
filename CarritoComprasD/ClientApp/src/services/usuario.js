import { BehaviorSubject } from 'rxjs';
import { fetchWrapper , history } from '@helpers';

const usuarioSubject = new BehaviorSubject(null);
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
    usuario: usuarioSubject.asObservable(),
    get usuarioValue () { return usuarioSubject._value }
};

function login(email, password) {
 
    return fetchWrapper.post(`${baseUrl}/authenticate`, { email, password })
        .then(usuario => {
            //publicar el usuario a los suscriptores e iniciar el temporizador para actualizar el token
            usuarioSubject.next(usuario);
            startRefreshTokenTimer();
            return usuario;
        });
}

function logout() {
        // revoke token, stop refresh timer, publish null to user subscribers and redirect to login page
        fetchWrapper.post(`${baseUrl}/revoke-token`, {});
        stopRefreshTokenTimer();
        usuarioSubject.next(null);
        history.push('/usuario/login');
}

function refreshToken() {
    return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
        .then(usuario => {
            // publicar el usuario a los suscriptores e iniciar el temporizador para actualizar el token
            usuarioSubject.next(usuario);
            startRefreshTokenTimer();
            return usuario;
        })
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
            if (usuario.id === usuarioSubject.value.id) {
                // publish updated usuario to subscribers
                usuario = { ...usuarioSubject.value, ...usuario };
                usuarioSubject.next(usuario);
            }
            return usuario;
        });
}

// prefixed with underscore because 'delete' is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
        .then(x => {
            // auto logout if the logged in usuario deleted their own record
            if (id === usuarioSubject.value.id) {
                logout(idUsuario);
            }
            return x;
        });
}

// helper functions
let refreshTokenTimeout;

//esta funcion activa un temporizador que vence un minuto antes de que expire el token
function startRefreshTokenTimer() {
    // parse json object from base64 encoded token

    if(usuarioSubject) {
        if(usuarioSubject.value) {
            if(usuarioSubject.value.token) {
                const token = JSON.parse(atob(usuarioSubject.value.token.split('.')[1]));

                // set a timeout to refresh the token a minute before it expires
                const expires = new Date(token.exp * 1000);
                const timeout = expires.getTime() - Date.now() - (60 * 1000);
                
            
                refreshTokenTimeout = setTimeout(refreshToken, timeout);
            }
        }
       
    }


}

//esta funcion limpia el temporizador
function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}




