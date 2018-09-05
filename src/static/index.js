import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';

import Root from './containers/Root/Root';
import configureStore from './store/configureStore';


const initialState = {};
const target = document.getElementById('root');

const history = createHistory();
const store = configureStore(initialState, history);

const node = (
    <Root store={store} history={history} />
);

ReactDOM.render(node, target);
