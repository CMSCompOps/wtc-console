import fetch from 'isomorphic-fetch';

import {SERVER_URL} from '../utils/config';
import {checkHttpStatus, parseJSON} from '../utils';
import {FETCH_DATA_FAILURE} from '../constants';


function success(type, payload) {
    return {type, payload};
}

function request(type) {
    return {type};
}

function fetchDataFailure(error, message) {
    return {
        type: FETCH_DATA_FAILURE,
        payload: {
            status: error,
            statusText: message
        }
    };
}

export function fetchProtectedData(url, requestType, successType) {
    return (dispatch, state) => {
        dispatch(request(requestType));
        return fetch(`${SERVER_URL}${url}`, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
            },
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch(success(successType, response));
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    dispatch(fetchDataFailure(error.response.status, 'A server error occurred while sending your data!'));
                } else {
                    dispatch(fetchDataFailure('Connection Error', 'An error occurred while sending your data!'));
                }

                return Promise.resolve();
            });
    };
}

export function saveProtectedData(url, data, requestType, successType) {
    return (dispatch, state) => {
        dispatch(request(requestType));
        return fetch(`${SERVER_URL}${url}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch(success(successType, response));
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    dispatch(fetchDataFailure(error.response.status, 'A server error occurred while sending your data!'));
                } else {
                    dispatch(fetchDataFailure('Connection Error', 'An error occurred while sending your data!'));
                }

                return Promise.resolve();
            });
    };
}

export function flipModal(requestType) {
    return (dispatch,state) => {
        dispatch(request(requestType));
    }
}
