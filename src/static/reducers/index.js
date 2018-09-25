import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import workflowsReducer from './workflows';
import workflowReducer from './workflow';
import prepsReducer from './preps';
import prepReducer from './prep';
import tasksReducer from './tasks';
import sitesReducer from './sites';

export default combineReducers({
    prep: prepReducer,
    preps: prepsReducer,
    sites: sitesReducer,
    workflow: workflowReducer,
    workflows: workflowsReducer,
    tasks: tasksReducer,
    routing: routerReducer,
});
