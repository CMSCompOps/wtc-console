import React from 'react';
import { Route, Switch } from 'react-router';
import { LoginView, PrepView, PrepsView, WorkflowView, WorkflowsView, TasksView, NotFoundView } from './containers';

export default(
    <Switch>
        <Route exact path="/" component={LoginView} />
        <Route exact path="/preps/:id" component={PrepView} />
        <Route exact path="/preps" component={PrepsView} />
        <Route exact path="/workflows/:id" component={WorkflowView} />
        <Route exact path="/workflows" component={WorkflowsView} />
        <Route exact path="/tasks" component={TasksView} />
        <Route path="*" component={NotFoundView} />
    </Switch>

);
