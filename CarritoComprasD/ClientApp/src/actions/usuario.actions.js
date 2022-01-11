import { usuarioConstantes } from './types';
import { usuarioService , alertService } from '../services';
import { history } from '../components/helpers';


export const usuarioActions = {
    login,
    logout,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    validateResetToken,
    getById,
    update
};

function login(email, password) {
    return dispatch => {
        alertService.clear();
        dispatch(request());

    return new Promise((resolve, reject) => {
            usuarioService.login(email, password)
                .then(
                    usuario => { 
                        dispatch(success(usuario));
                        history.push('/');
                        resolve(usuario); // respuesta correcta
                    },
                    error => {    
                        alertService.error(error);
                        reject(error); // respuesta error
                    })
        })
    };

    function request() { return { type: usuarioConstantes.LOGIN_REQUEST } }
    function success(usuario) { return { type: usuarioConstantes.LOGIN_SUCCESS,  usuario } }
    
}



function logout() {
    return dispatch => {
        return new Promise((resolve, reject) => {
            usuarioService.logout()
                    .then(
                        mensaje => { 
                            dispatch(success());  
                            resolve(mensaje); // respuesta correcta
                        },
                        error => {    
                            reject(error); // respuesta error
                        })
            })
        };


    function success() { return { type: usuarioConstantes.LOGOUT_SUCCESS } } 
}



function register(usuario) {
    return dispatch => {
        dispatch(request(usuario));

        return new Promise((resolve, reject) => {
            usuarioService.register(usuario)
                    .then(
                        usuario => { 
                            dispatch(success(usuario));
                            
                            alertService.success('Registro exitoso, contáctese con el administrador para que active su cuenta');
                            setTimeout(() => {
                                history.push('login');
                              }, 3000);
                            resolve(usuario); // respuesta correcta
                        },
                        error => {
                            dispatch(failure());
                            alertService.error(error);
                            reject(error); // respuesta error
                        }
                    );
                })
            };
        
      

    function request(usuario) { return { type: usuarioConstantes.REGISTER_REQUEST,  usuario } }
    function success(usuario) { return { type: usuarioConstantes.REGISTER_SUCCESS, usuario } }
    function failure() { return { type: usuarioConstantes.REGISTER_FAILURE } }
}



function verifyEmail(token) {
    return dispatch => {
        dispatch(request(token));

        return new Promise((resolve, reject) => {
            usuarioService.verifyEmail(token)
                    .then(
                           () => { 
                            dispatch(success());
                            alertService.success('Verificación exitosa, ahora puede iniciar sesión');
                            setTimeout(() => {
                                history.push('login');
                              }, 3000);
                            resolve(token); // respuesta correcta
                        },
                        error => {
                            dispatch(failure());
                            reject(error); // respuesta error
                        }
                    );
                })
            };
        
      

    function request(token) { return { type: usuarioConstantes.VERIFY_EMAIL_REQUEST,  token } }
    function success() { return { type: usuarioConstantes.VERIFY_EMAIL_SUCCESS } }
    function failure() { return { type: usuarioConstantes.VERIFY_EMAIL_FAILURE } }
}


  
function forgotPassword(email) {
    return dispatch => {
        alertService.clear();
        dispatch(request(email));

        return new Promise((resolve, reject) => {
            usuarioService.forgotPassword(email)
                    .then(
                          () => { 
                            dispatch(success());
                            alertService.success('Por favor revise su correo electrónico para obtener instrucciones de restablecimiento de contraseña');
                            setTimeout(() => {
                                history.push('login');
                              }, 3000);
                            resolve(email); // respuesta correcta
                        },
                        error => {
                            dispatch(failure());
                            alertService.error(error);
                            reject(error); // respuesta error
                        }
                    );
                })
            };
        
      

    function request(email) { return { type: usuarioConstantes.FORGOT_PASSWORD_REQUEST,  email } }
    function success() { return { type: usuarioConstantes.FORGOT_PASSWORD_SUCCESS } }
    function failure() { return { type: usuarioConstantes.FORGOT_PASSWORD_FAILURE } }
}

function validateResetToken(token) {
    return dispatch => {
        alertService.clear();
        dispatch(request(token));

        return new Promise((resolve, reject) => {
            usuarioService.validateResetToken(token)
                    .then(
                          () => { 
                            dispatch(success());
                            resolve(token); // respuesta correcta
                        },
                        error => {
                            dispatch(failure());
                            alertService.error(error);
                            reject(error); // respuesta error
                        }
                    );
                })
            };
        
      

    function request(token) { return { type: usuarioConstantes.VALIDATE_RESET_TOKEN_REQUEST,  token } }
    function success() { return { type: usuarioConstantes.VALIDATE_RESET_TOKEN_SUCCESS } }
    function failure() { return { type: usuarioConstantes.VALIDATE_RESET_TOKEN_FAILURE } }
}

function resetPassword(payload) {
    return dispatch => {
        alertService.clear();
        dispatch(request(payload));

        return new Promise((resolve, reject) => {
            usuarioService.resetPassword(payload)
                    .then(
                          () => { 
                            dispatch(success(payload));
                            alertService.success('Restablecimiento de contraseña exitoso, ahora puede iniciar sesión');
                            setTimeout(() => {
                                history.push('login');
                              }, 3000);
                            resolve(payload.password); // respuesta correcta
                        },
                        error => {
                            dispatch(failure());
                            alertService.error(error);
                            reject(error); // respuesta error
                        }
                    );
                })
            };
        
      

    function request(payload) { return { type: usuarioConstantes.RESET_PASSWORD_REQUEST,   payload  } }
    function success(payload) { return { type: usuarioConstantes.RESET_PASSWORD_SUCCESS, payload } }
    function failure() { return { type: usuarioConstantes.RESET_PASSWORD_FAILURE } }
}

function getById(idUsuario) {

    return dispatch => {
        dispatch(request(idUsuario));


        return new Promise((resolve, reject) => {
            usuarioService.getById(idUsuario)
                    .then(
                        usuario => { 
                            dispatch(success(usuario))
                            resolve(usuario); // respuesta correcta
                        },
                        error => {
                            dispatch(failure(error.toString()))
                            reject(error); // respuesta error
                        }
                        );
                    })
                };
       
    function request(idUsuario) { return { type: usuarioConstantes.GET_BY_ID_REQUEST , idUsuario } }
    function success(usuario) { return { type: usuarioConstantes.GET_BY_ID_SUCCESS, usuario } }
    function failure(error) { return { type: usuarioConstantes.GET_BY_ID_FAILURE, error } }
}


function update(idUsuario,data) {

    const payload = {
        idUsuario,
        data
    };

    return dispatch => {
        dispatch(request());


        return new Promise((resolve, reject) => {
            usuarioService.update(payload)
                    .then(
                        usuario => { 
                            dispatch(success(usuario))
                            alertService.success('Actualización exitosa , en caso de haber cambiando la contraseña , en el proximo inicio de sesion debe colocar la nueva');
                            setTimeout(() => {
                                history.push('./dashboard');
                              }, 3000);
                            resolve(usuario); // respuesta correcta
                        },
                        error => {
                            dispatch(failure(error.toString()))
                            alertService.error(error);
                            reject(error); // respuesta error
                        }
                        );
                    })
                };
       
    function request() { return { type: usuarioConstantes.UPDATE_REQUEST} }
    function success(usuario) { return { type: usuarioConstantes.UPDATE_SUCCESS, usuario } }
    function failure() { return { type: usuarioConstantes.UPDATE_FAILURE } }
 };