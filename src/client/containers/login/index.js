import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Col, Button, Form, FormGroup, Input
} from 'reactstrap';

import {
  logInUser,
  logOutUser,
} from '../../modules/auth';

import './login.css';

const initialState = {
  credentials: {
    email: '',
    password: ''
  }
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    };
  }

  handleChange = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { name, value } = e.target;
    const { credentials } = this.state;
    credentials[name] = value;
    this.setState({ credentials });
  };

  handleSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { logInUser, goToHome } = this.props;
    const { credentials } = this.state;
    logInUser(credentials)
      .then(user => goToHome(user))
      .catch((e) => {
        alert('Please enter valid credentials.');
        console.log(e);
      });
  };

  render() {
    const { credentials } = this.state;
    return (
      <div className="login-wrapper">
        <Form onSubmit={this.handleSubmit}>
          <FormGroup row>
            <Col sm={10}>
              Email
              <Input type="email" name="email" id="email-input" placeholder="Email" value={credentials.email} onChange={this.handleChange} required />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={10}>
              Password
              <Input type="password" name="password" id="password-input" placeholder="Password" value={credentials.password} onChange={this.handleChange} required />
            </Col>
          </FormGroup>
          <FormGroup check row>
            <br />
            <Button type="submit" id="submit-button">Submit</Button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth && state.auth.user });

const mapDispatchToProps = dispatch => bindActionCreators({
  logInUser,
  logOutUser,
  goToHome: () => push('/')
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
