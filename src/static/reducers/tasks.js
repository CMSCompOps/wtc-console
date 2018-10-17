import {
    FETCH_TASKS_REQUEST,
    FETCH_TASKS_SUCCESS,
} from '../constants';
import {createTree} from '../utils/tree';

const initialState = {
    data: null,
    isFetching: false
};

function enrichWithWorkflowsTree(data) {
    return {
        ...data,
        results: data.results.map(prep => {
            const workflows = prep.workflows.map(w => {
                return {...w, id: w.name, parent: w.parent_workflow, children: []}
            });

            return {
                ...prep,
                workflows: createTree(workflows),
            }
        }),
    }
}

export default function prepsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TASKS_REQUEST:
            return {...state,
                isFetching: true,
            };
        case FETCH_TASKS_SUCCESS:
            return {...state,
                data: enrichWithWorkflowsTree(action.payload),
                isFetching: false,
            };

        default:
            return state;
    }
}

