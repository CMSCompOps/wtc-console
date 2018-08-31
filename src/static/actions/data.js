import {
    FETCH_WORKFLOWS_REQUEST,
    FETCH_WORKFLOWS_SUCCESS,
    FETCH_WORKFLOW_REQUEST,
    FETCH_WORKFLOW_SUCCESS,
    FETCH_PREP_REQUEST,
    FETCH_PREP_SUCCESS,
    FETCH_PREPS_REQUEST,
    FETCH_PREPS_SUCCESS,
    FETCH_SITES_REQUEST,
    FETCH_SITES_SUCCESS,
} from '../constants';
import {fetchProtectedData} from './api'


export function fetchPreps(token, page, size, filter, orderBy, orderDesc) {
    return fetchProtectedData(
        token,
        `/api/v1/workflows/preps/?page=${page || 1}&page_size=${size || 20}&filter=${filter || ''}&order_key=${orderBy || ''}&order_desc=${!!orderDesc}`,
        FETCH_PREPS_REQUEST,
        FETCH_PREPS_SUCCESS,
    );
}

export function fetchPrep(token, prepId) {
    return fetchProtectedData(
        token,
        `/api/v1/workflows/preps/${prepId}/`,
        FETCH_PREP_REQUEST,
        FETCH_PREP_SUCCESS,
    );
}

export function fetchWorkflows(token, page, size, filter, orderBy, orderDesc) {
    return fetchProtectedData(
        token,
        `/api/v1/workflows/workflows/?page=${page || 1}&page_size=${size || 20}&filter=${filter || ''}&order_key=${orderBy || ''}&order_desc=${!!orderDesc}`,
        FETCH_WORKFLOWS_REQUEST,
        FETCH_WORKFLOWS_SUCCESS,
    );
}

export function fetchWorkflow(token, workflowId) {
    return fetchProtectedData(
        token,
        `/api/v1/workflows/workflows/${workflowId}/`,
        FETCH_WORKFLOW_REQUEST,
        FETCH_WORKFLOW_SUCCESS,
    );
}

export function fetchSites(token) {
    return fetchProtectedData(
        token,
        `/api/v1/workflows/sites/`,
        FETCH_SITES_REQUEST,
        FETCH_SITES_SUCCESS,
    );
}
