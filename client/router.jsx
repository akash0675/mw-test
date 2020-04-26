import React from 'react';
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import Login from './../imports/ui/Login';
import Home from '../imports/ui/Home';

const browserHistory = createBrowserHistory();

export const RenderRoutes = () => (
    <Router history={browserHistory}>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/home' component={Home} />
        </Switch>
    </Router>
);
