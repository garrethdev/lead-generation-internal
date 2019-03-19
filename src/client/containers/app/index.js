import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Login from '../login';
import Home from '../home';

import NewCampaign from '../newCampaign';
import Route404 from '../route404';
import './app.css';
import { logOutUser } from '../../modules/auth';

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
      <main>
        <Switch>
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/newCampaign" component={NewCampaign} />
          <PrivateRoute exact path="/" component={Home} />
          <Route path="*" component={Route404} />
        </Switch>
      </main>
    </div>
  );
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  logOutUser,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
