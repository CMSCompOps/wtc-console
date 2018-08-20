import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth';
import workflowsReducer from './workflows';
import workflowReducer from './workflow';
import prepsReducer from './preps';
import prepReducer from './prep';

export default combineReducers({
    auth: authReducer,
    prep: prepReducer,
    preps: prepsReducer,
    workflow: workflowReducer,
    workflows: workflowsReducer,
    routing: routerReducer,
});
