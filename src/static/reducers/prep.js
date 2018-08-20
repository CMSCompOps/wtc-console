import {
    FETCH_PREP_REQUEST,
    FETCH_PREP_SUCCESS,
} from '../constants';

const initialState = {
    data: null,
    isFetching: false
};

export default function prepReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_PREP_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_PREP_SUCCESS:
            return {...state,
                data: action.payload,
                isFetching: false,
            };

        default:
            return state;
    }
}

