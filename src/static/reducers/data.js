import {
    FETCH_WORKFLOWS_REQUEST,
    FETCH_WORKFLOWS_SUCCESS,
} from '../constants';

const initialState = {
    data: null,
    isFetching: false
};

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_WORKFLOWS_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_WORKFLOWS_SUCCESS:
            return {...state,
                data: action.payload.data,
                isFetching: false,
            };

        default:
            return state;
    }
}

