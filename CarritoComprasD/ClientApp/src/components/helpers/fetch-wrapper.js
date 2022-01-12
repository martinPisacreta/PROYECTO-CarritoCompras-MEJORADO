export  const fetchWrapper = {
    get,
    post,
    postSinCovertirBodyEnJson,
    put,
    delete: _delete
}





async function get(url) {
    let usuario = JSON.parse(localStorage.getItem('user'));
    const  requestOptions =
                            usuario ? {
                                        method: 'GET',
                                        headers: await authHeader(url)}
                                    : { method: 'GET' }

    return  fetch(url, requestOptions).then(handleResponse)
}

//ACA LE SACO DOS COSAS YA QUE NO NECESITO TRANFORMAR NADA EN JSON -> 
                        //'Content-Type': 'application/json' -> ya que Indica que el formato del cuerpo de la solicitud es JSON.
                        //JSON.stringify(body) -> ya que transforma el body en json
async function postSinCovertirBodyEnJson(url, body) {
    let usuario = JSON.parse(localStorage.getItem('user'));
    const requestOptions = 
    usuario ? {
                method: 'POST',
                headers: { ...await authHeader(url) },
                body: body }
            : {
                method: 'POST',   
                body: body }
    return fetch(url, requestOptions).then(handleResponse);
}


async function post(url, body) {
    let usuario = JSON.parse(localStorage.getItem('user'));
    const requestOptions = 
    usuario ? {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...await authHeader(url) },
                body: JSON.stringify(body) }
            : {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(body)}
    
    
    return fetch(url, requestOptions).then(handleResponse);
}

async function put(url, body) {
    

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...await authHeader(url) },
        body: JSON.stringify(body)
    };
    
    return fetch(url, requestOptions).then(handleResponse);    
}


// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url) {
    
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}



async function authHeader(url) {


    let usuario = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = usuario && usuario.token;
    const isApiUrl = url.startsWith(process.env.PUBLIC_URL);


    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${usuario.token}` };
    } else {
    
        return {};
    }
}

function handleResponse(response) {
    
    return response.text()
    .then(text => {
       
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].includes(response.status)) {

                const error = "Acceso no autorizado" + ' -- ' +  response.status;
                //usuarioService.logout();

                //LA LINEA DE ABAJO SE RELACIONA TAMBIEN CON ...src\routes\private_route_admin.jsx
                window.location = `${process.env.PUBLIC_URL}`; 
                
                return Promise.reject(new Error(error));
               
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
  
        }
        else{
            return data;
        }
       
    });
}