import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Login from '../login';
import List from '../list';
import Campaigns from '../campaigns';
import Route404 from '../route404';
import './app.css';
import { logOutUser } from '../../modules/auth';
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
    <main>
      <div>
        {props.user && <NavigationBar />}
        <Switch>
          <PublicRoute exact path="/login" component={Login} />
          <PrivateRoute exact path="/campaigns" component={Campaigns} />
          <PrivateRoute exact path="/" component={List} />
          <Route path="*" component={Route404} />
        </Switch>
      </div>
    </main>
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
