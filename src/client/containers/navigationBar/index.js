import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button, Col,
  Navbar, NavbarBrand
} from 'reactstrap';
import { logOutUser } from '../../modules/auth';

class NavigationBar extends React.Component {
  render() {
    const { user, logOutUser } = this.props;
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">{`Hello, ${user.email.split('@')[0]}`}</NavbarBrand>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button onClick={logOutUser}>logout</Button>
          </Col>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth && state.auth.user });

const mapDispatchToProps = dispatch => bindActionCreators({
  logOutUser
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationBar);
