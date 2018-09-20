import {
    FETCH_TASKS_ACTIONS_REQUEST,
    FETCH_TASKS_ACTIONS_SUCCESS,
} from '../constants';

const initialState = {
    data: null,
    isFetching: false
};

export default function prepsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TASKS_ACTIONS_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_TASKS_ACTIONS_SUCCESS:
            return {...state,
                data: action.payload,
                isFetching: false,
            };

        default:
            return state;
    }
}

