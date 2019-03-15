import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import Login from '../login';
import Home from '../home';
import NewCampaign from '../newCampaign';

import Template from '../template';
import './app.css';
import { bindActionCreators } from 'redux';
import { logInUser, logOutUser } from '../../modules/auth';
import { push } from 'react-router-redux';

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
      {
        props.user
          ? (
            <div>
              <label className="tag-line">Incertae.io Lead Generation Platform</label>
              <Button className="log-out" outline color="secondary" id="log-out" onClick={props.logOutUser}>
                LOGOUT
              </Button>
            </div>
          ) : null
      }
      <main>
        <Switch>
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/newCampaign" component={NewCampaign} />
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute path="*" component={Template} />
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
