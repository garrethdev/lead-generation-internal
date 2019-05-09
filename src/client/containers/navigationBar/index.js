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
import logo from '../../../assets/ArborVita-black.png';
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
      <header>
        <Navbar light expand="md" className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-end">
          <NavbarBrand href="/">
            <img src={logo} alt="Arbor Vita" className="img-fluid" />
          </NavbarBrand>
          <span className="navbar-text p-0">
            Incertae.io Lead Generation Platform
          </span>
          </div>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav navbar>
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
                    <span style={{ color: '#5c8d89' }}>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
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
