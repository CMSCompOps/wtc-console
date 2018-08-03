import React from 'react';
import { Route, Switch } from 'react-router';
import { LoginView, WorkflowsView, NotFoundView } from './containers';
import requireAuthentication from './utils/requireAuthentication';

export default(
    <Switch>
        <Route exact path="/" component={LoginView} />
        <Route path="/workflows" component={requireAuthentication(WorkflowsView)} />
        <Route path="*" component={NotFoundView} />
    </Switch>

);
