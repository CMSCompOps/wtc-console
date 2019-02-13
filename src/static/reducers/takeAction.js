import {
    SAVE_TASKS_ACTIONS_REQUEST,
    SAVE_TASKS_ACTIONS_SUCCESS,
    FLIP_MODAL_VISIBILITY,
} from '../constants';
import {createTree} from '../utils/tree';

const initialState = {
    data: null,
    isPosting: false
};

export default function takeActionReducer(state = initialState, action) {
    switch (action.type) {
        case SAVE_TASKS_ACTIONS_REQUEST:
            return {...state,
                isPosting: true,
                msgModal: "Action is being submitted...",
            };
        case SAVE_TASKS_ACTIONS_SUCCESS:
            return {...state,
                data: action.payload,
                isPosting: false,
                showModal: true,
                msgModal: "Action succesfully submitted!",
            };
        case FLIP_MODAL_VISIBILITY:
            const {showModal} = state;
            return {...state,
                showModal: !showModal,
            };
        default:
            return state;
    }
}
