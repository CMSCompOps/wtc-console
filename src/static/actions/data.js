import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';

import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import { FETCH_WORKFLOWS_REQUEST, FETCH_WORKFLOWS_SUCCESS, FETCH_WORKFLOWS_FAILURE } from '../constants';
import { authLoginUserFailure } from './auth';


function success(type, payload) {
    return { type, payload };
}

function request(type) {
    return { type };
}

function fetchProtectedData(token, url, requestType, successType) {
    return (dispatch, state) => {
        dispatch(request(requestType));
        return fetch(`${SERVER_URL}${url}`, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                Authorization: `Token ${token}`
            }
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then((response) => {
                dispatch(success(successType, response.data));
            })
            .catch((error) => {
                if (error && typeof error.response !== 'undefined' && error.response.status === 401) {
                    // Invalid authentication credentials
                    return error.response.json().then((data) => {
                        dispatch(authLoginUserFailure(401, data.non_field_errors[0]));
                        dispatch(push('/login'));
                    });
                } else if (error && typeof error.response !== 'undefined' && error.response.status >= 500) {
                    // Server side error
                    dispatch(authLoginUserFailure(500, 'A server error occurred while sending your data!'));
                } else {
                    // Most likely connection issues
                    dispatch(authLoginUserFailure('Connection Error', 'An error occurred while sending your data!'));
                }

                dispatch(push('/login'));
                return Promise.resolve(); // TODO: we need a promise here because of the tests, find a better way
            });
    };
}

export function fetchWorkflows(token) {
    return fetchProtectedData(token, '/api/v1/workflows/workflow/', FETCH_WORKFLOWS_REQUEST, FETCH_WORKFLOWS_SUCCESS);
}
