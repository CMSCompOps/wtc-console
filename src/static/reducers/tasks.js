import {
    FETCH_TASKS_REQUEST,
    FETCH_TASKS_SUCCESS,
} from '../constants';

const initialState = {
    data: null,
    isFetching: false
};

export default function prepsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TASKS_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_TASKS_SUCCESS:
            return {...state,
                data: action.payload,
                isFetching: false,
            };

        default:
            return state;
    }
}

