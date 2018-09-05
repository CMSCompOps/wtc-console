import React from 'react';
import { Route, Switch } from 'react-router';
import { LoginView, PrepView, PrepsView, WorkflowView, WorkflowsView, TasksView, NotFoundView } from './containers';
import requireAuthentication from './utils/requireAuthentication';

export default(
    <Switch>
        <Route exact path="/" component={LoginView} />
        <Route exact path="/preps/:id" component={requireAuthentication(PrepView)} />
        <Route exact path="/preps" component={requireAuthentication(PrepsView)} />
        <Route exact path="/workflows/:id" component={requireAuthentication(WorkflowView)} />
        <Route exact path="/workflows" component={requireAuthentication(WorkflowsView)} />
        <Route exact path="/tasks" component={requireAuthentication(TasksView)} />
        <Route path="*" component={NotFoundView} />
    </Switch>

);
