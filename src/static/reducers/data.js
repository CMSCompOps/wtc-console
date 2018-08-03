import {
    FETCH_WORKFLOWS_REQUEST,
    FETCH_WORKFLOWS_SUCCESS,
} from '../constants';

const initialState = {
    data: null,
    isFetching: false
};

export default function dataReducer(state = initialState, action) {
    console.log('action in reducer', action);
    switch (action.type) {
        case FETCH_WORKFLOWS_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_WORKFLOWS_SUCCESS:
            return {...state,
                data: action.payload,
                isFetching: false,
            };

        default:
            return state;
    }
}

