import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { TasksView, NotFoundView } from './containers';

export default(
    <Switch>
        <Route exact path="/tasks" component={TasksView} />
        <Redirect exact from="/" to="/tasks" />
        <Route path="*" component={NotFoundView} />
    </Switch>
);
