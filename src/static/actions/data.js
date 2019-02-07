import {
    FETCH_TASKS_REQUEST,
    FETCH_TASKS_SUCCESS,
    FETCH_SITES_REQUEST,
    FETCH_SITES_SUCCESS,
    SAVE_TASKS_ACTIONS_REQUEST,
    SAVE_TASKS_ACTIONS_SUCCESS,
    FETCH_SITES_STATUS_REQUEST,
    FETCH_SITES_STATUS_SUCCESS,
    FLIP_MODAL_VISIBILITY,
} from '../constants';
import {fetchProtectedData, saveProtectedData, flipModal} from './api'

export function fetchTasks(page, size, filter, orderBy) {
    return fetchProtectedData(
        `/api/v1/workflows/tasks/?page=${page || 1}&page_size=${size || 20}&filter=${filter || ''}&order_key=${orderBy || ''}`,
        FETCH_TASKS_REQUEST,
        FETCH_TASKS_SUCCESS,
    );
}

export function saveTasksActions(tasksActions) {
    return saveProtectedData(
        `/api/v1/workflows/tasks-actions/`,
        tasksActions,
        SAVE_TASKS_ACTIONS_REQUEST,
        SAVE_TASKS_ACTIONS_SUCCESS,
    );
}

export function fetchSites() {
    return fetchProtectedData(
        `/api/v1/workflows/sites/`,
        FETCH_SITES_REQUEST,
        FETCH_SITES_SUCCESS,
    );
}

export function fetchSitesStatus() {
    return fetchProtectedData(
	`/api/v1/misc/sites/status/`,
	FETCH_SITES_STATUS_REQUEST,
	FETCH_SITES_STATUS_SUCCESS,
    );
}

export function flipModalVisibility() {
    return flipModal(
        FLIP_MODAL_VISIBILITY
    )
}
