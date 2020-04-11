import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { isAuthenticated } from 'services/auth';

import Login from 'views/Login/Login';
import PacientList from 'views/PacientList/PacientList';
import PacientDetails from 'views/PacientDetails/PacientDetails';
import PacientNew from 'views/PacientNew/PacientNew';
import PacientEdit from 'views/PacientEdit/PacientEdit';
import NotFound from 'views/NotFound/NotFound';

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
      <PrivateRoute exact path="/pacient/:id" component={() => <PacientDetails />} />
      <PrivateRoute exact path="/new-pacient" component={() => <PacientNew />} />
      <PrivateRoute exact path="/pacient/:id/edit" component={() => <PacientEdit />} />
      <Route path="*" component={() => <NotFound />} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
