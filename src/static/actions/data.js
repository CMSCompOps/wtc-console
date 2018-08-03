import { FETCH_WORKFLOWS_REQUEST, FETCH_WORKFLOWS_SUCCESS } from '../constants';
import { fetchProtectedData } from './api'


export function fetchWorkflows(token, page, size) {
    return fetchProtectedData(
        token,
        `/api/v1/workflows/workflow/?page=${page || 1}&page_size=${size || 20}`,
        FETCH_WORKFLOWS_REQUEST,
        FETCH_WORKFLOWS_SUCCESS,
    );
}
