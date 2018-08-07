import {
    FETCH_WORKFLOWS_REQUEST,
    FETCH_WORKFLOWS_SUCCESS,
    FETCH_WORKFLOW_REQUEST,
    FETCH_WORKFLOW_SUCCESS,
} from '../constants';
import {fetchProtectedData} from './api'


export function fetchWorkflows(token, page, size) {
    return fetchProtectedData(
        token,
        `/api/v1/workflows/workflows/?page=${page || 1}&page_size=${size || 20}`,
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
