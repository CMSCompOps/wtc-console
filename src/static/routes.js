import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { PrepView, PrepsView, WorkflowView, WorkflowsView, TasksView, NotFoundView } from './containers';

export default(
    <Switch>
        <Route exact path="/tasks" component={TasksView} />
        <Route exact path="/preps/:id" component={PrepView} />
        <Route exact path="/preps" component={PrepsView} />
        <Route exact path="/workflows/:id" component={WorkflowView} />
        <Route exact path="/workflows" component={WorkflowsView} />
        <Redirect exact from="/" to="/tasks" />
        <Route path="*" component={NotFoundView} />
    </Switch>
);
