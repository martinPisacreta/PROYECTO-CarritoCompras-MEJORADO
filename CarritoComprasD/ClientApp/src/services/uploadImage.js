import { BehaviorSubject } from 'rxjs';

import { fetchWrapper, history } from '../components/helpers';

const baseUrl = `/api/ArticulosUploadImage`;




export const articulosUploadImageService = {
    uploadFilesInServer,
};



function uploadFilesInServer(params) {
    return fetchWrapper.postSinCovertirBodyEnJson(`${baseUrl}`, params);
}

