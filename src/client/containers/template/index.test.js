import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import Template from './index';

const initialState = { output: 100 };

describe('>>>>> Template --- Shallow render react component', () => {
  const mockStore = configureStore();
  let store; let wrapper; let
    template;

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><Template /></Provider>);
    template = wrapper.find('Template');
  });

  it('on send button clicked', () => {
    const buttonSend = template.find('#button-send');
    expect(buttonSend).toHaveLength(2);
    // buttonSend.at(0).simulate('click');
  });
});
