import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth';
import workflowsReducer from './workflows';
import workflowReducer from './workflow';

export default combineReducers({
    auth: authReducer,
    workflow: workflowReducer,
    workflows: workflowsReducer,
    routing: routerReducer
});
