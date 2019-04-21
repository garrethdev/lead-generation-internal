import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { logOutUser } from '../../modules/auth';
import { getLists } from '../../modules/mailChimp';

import './navigationBar.css';

class NavigationBar extends React.Component {
  state = { isOpen: false };

  componentDidMount() {
    const { getLists } = this.props;
    getLists();
  }

  toggle = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  render() {
    const { user: { email = '' } = {}, logOutUser } = this.props;
    const { isOpen } = this.state;
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Incertae.io Lead Generation Platform</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink exact to="/" activeClassName="active" tag={RRNavLink}>Lists</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/campaigns" activeClassName="active" tag={RRNavLink}>Campaigns</NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {email.split('@')[0]}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={logOutUser}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getLists,
  logOutUser
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationBar);
