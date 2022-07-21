import { fetchWrapper} from '@helpers';

const baseUrl = `/api/ArticulosUploadImage`;




export const articulosUploadImageService = {
    uploadFilesInServer,
};



function uploadFilesInServer(params) {
    return fetchWrapper.post(`${baseUrl}`, params);
}

