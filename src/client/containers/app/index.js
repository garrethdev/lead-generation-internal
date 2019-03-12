import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Login from '../login';
import CSV from '../csv';
import Campaign from '../campaigns';
import Template from '../template';
import NavigationBar from '../navigationBar';

const App = (props) => {
  const PublicRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={routeProps => (
        !props.user
          ? <Component {...routeProps} />
          : <Redirect to="/" />
      )}
    />
  );
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={routeProps => (
        props.user
          ? <Component {...routeProps} />
          : <Redirect to="/login" />
      )}
    />
  );
  return (
    <div className="container app-wrapper">
      {props.user && <NavigationBar />}
      <main>
        <Switch>
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/uploadTemplate" component={Template} />
          <PrivateRoute exact path="/addCampaignDetails" component={Campaign} />
          <PrivateRoute exact path="/uploadCSV" component={CSV} />
          <PrivateRoute exact path="/" component={Template} />
          <PrivateRoute path="*" component={Template} />
        </Switch>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default withRouter(connect(
  mapStateToProps,
  null
)(App));
