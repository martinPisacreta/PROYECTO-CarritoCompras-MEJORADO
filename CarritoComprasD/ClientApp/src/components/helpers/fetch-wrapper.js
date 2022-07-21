import { usuarioService } from '@services'

//NO PONER NADA ASINCRONICO ACA , PORQUE AL HACERLO ANDA MAL TODO
export  const fetchWrapper = {
    get,
    post,
    put,
    delete: _delete
}





function get(url) {
    const requestOptions = {
        method: 'GET',
        headers : authHeader(url)
    }
    return fetch(url, requestOptions).then(handleResponse);
}




function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
}


// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}


function authHeader(url) {


    let usuario = usuarioService.usuarioValue;
    const isLoggedIn = usuario && usuario.token;
    const isApiUrl = url.startsWith(process.env.PUBLIC_URL);
 

   
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${usuario.token}` };
    } else {
        return {};
    }
}

function handleResponse(response) {
            return response.text().then(text => {
                if(text)
                {
                    if(isJsonString(text))
                    {
                        const data = JSON.parse(text);
                        if (!response.ok) {
                            if ([401, 403].includes(response.status) && usuarioService.usuarioValue) {
                                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                                usuarioService.logout();
                            }
                
                            const error = (data && data.message) || response.statusText;
                            return Promise.reject(error);
                        }
                
                        return data;
                    }
                }
                return null;       
                    
            });
       
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}