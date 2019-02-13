import {
    FETCH_SITES_REQUEST,
    FETCH_SITES_SUCCESS,
    FETCH_SITES_STATUS_REQUEST,
    FETCH_SITES_STATUS_SUCCESS,
} from '../constants';

const initialState = {
    data: null,
    isFetching: false
};

export default function sitesStatusReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SITES_STATUS_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_SITES_STATUS_SUCCESS:
             return {...state,
                data: action.payload,
                isFetching: false,
             };
        default:
            return state;
    }
}


