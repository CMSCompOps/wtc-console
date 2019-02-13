import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasksReducer from './tasks';
import sitesReducer from './sites';
import sitesStatusReducer from './sitesStatus';
import takeActionReducer from './takeAction';

export default combineReducers({
    sites: sitesReducer,
    tasks: tasksReducer,
    routing: routerReducer,
    sitesStatus: sitesStatusReducer,
    takeAction: takeActionReducer,
});
