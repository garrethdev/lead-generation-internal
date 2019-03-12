import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import Login from './index';

const initialState = { output:100 };

describe('>>>>> Login --- Shallow render react component', () => {
  const mockStore = configureStore();
  let store, wrapper, login;

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><Login /></Provider>);
    login = wrapper.find('Login');
  });

  it('on change email', () => {
    const email = login.find('#email-input');
    expect(email).toHaveLength(2);
    email.at(0).simulate('change', { target: { name: 'email', value: 'admin@gmail.com' } });
    expect(login.instance().state.credentials.email).toEqual('admin@gmail.com');
  });

  it('on change password', () => {
    const password = login.find('#password-input');
    expect(password).toHaveLength(2);
    password.at(0).simulate('change', { target: { name: 'password', value: 'admin' } });
    expect(login.instance().state.credentials.password).toEqual('admin');
  });

  it('on submit clicked', () => {
    const submitButton = login.find('#submit-button')
    expect(submitButton).toHaveLength(2);
    submitButton.at(0).simulate('click');
  });

});
