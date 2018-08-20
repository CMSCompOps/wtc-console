import {
    FETCH_PREPS_REQUEST,
    FETCH_PREPS_SUCCESS,
} from '../constants';

const initialState = {
    data: null,
    isFetching: false
};

export default function prepsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_PREPS_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_PREPS_SUCCESS:
            return {...state,
                data: action.payload,
                isFetching: false,
            };

        default:
            return state;
    }
}

