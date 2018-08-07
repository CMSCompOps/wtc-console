import {
    FETCH_WORKFLOW_REQUEST,
    FETCH_WORKFLOW_SUCCESS,
} from '../constants';

const initialState = {
    data: null,
    isFetching: false
};

export default function workflowReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_WORKFLOW_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_WORKFLOW_SUCCESS:
            return {...state,
                data: action.payload,
                isFetching: false,
            };

        default:
            return state;
    }
}

