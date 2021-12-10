import { alertConstantes } from './types';

export const alertActions = {
    success,
    error,
    clear
};

function success(message) {
    return { type: alertConstantes.SUCCESS, message };
}

function error(message) {
    return { type: alertConstantes.ERROR, message };
}

function clear() {
    return { type: alertConstantes.CLEAR };
}