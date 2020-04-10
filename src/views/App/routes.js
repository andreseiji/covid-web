import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { isAuthenticated } from 'services/auth';

import Login from 'views/Login/Login';
import PacientList from 'views/PacientList/PacientList';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => isAuthenticated() ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: '/', state: { from: props.location } }} />
    )}
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={() => isAuthenticated() ? <PacientList /> : <Login />} />
      <PrivateRoute path="/other" component={() => <h1>other</h1>} />
      <Route path="*" component={() => <h1>404 Page not found</h1>} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
