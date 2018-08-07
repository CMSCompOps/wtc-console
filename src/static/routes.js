import React from 'react';
import { Route, Switch } from 'react-router';
import { LoginView, WorkflowView, WorkflowsView, NotFoundView } from './containers';
import requireAuthentication from './utils/requireAuthentication';

export default(
    <Switch>
        <Route exact path="/" component={LoginView} />
        <Route exact path="/workflows/:id" component={requireAuthentication(WorkflowView)} />
        <Route exact path="/workflows" component={requireAuthentication(WorkflowsView)} />
        <Route path="*" component={NotFoundView} />
    </Switch>

);
