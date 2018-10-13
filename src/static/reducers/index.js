import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasksReducer from './tasks';
import sitesReducer from './sites';

export default combineReducers({
    sites: sitesReducer,
    tasks: tasksReducer,
    routing: routerReducer,
});
