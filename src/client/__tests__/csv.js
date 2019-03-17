import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import CSVUpload from '../containers/csv';

const initialState = { output: 100 };
const props = { showLoader: jest.fn() };

describe('>>>>> CSV Upload --- Shallow render react component', () => {
  const mockStore = configureStore();
  let store; let wrapper; let
    csvUpload;

  beforeEach(() => {
    store = mockStore(initialState);
    // wrapper = mount(<Provider store={store}><CSVUpload /></Provider>);
    const div = document.createElement('div');
    document.body.appendChild(div);
    wrapper = mount(<Provider store={store}><CSVUpload {...props} /></Provider>, { attachTo: div });

    csvUpload = wrapper.find('CSVUpload');
  });

  it('on upload member button clicked', () => {
    shallow(<CSVUpload />);
  });
  //
  // it('on send button clicked', () => {
  //   const sendButton = csvUpload.find('#button-send');
  //   expect(sendButton).toHaveLength(2);
  //   sendButton.at(0).simulate('click');
  // });
  //
  // it('on schedule button clicked', () => {
  //   const scheduleButton = csvUpload.find('#button-schedule');
  //   expect(scheduleButton).toHaveLength(2);
  //   scheduleButton.at(0).simulate('click');
  // });
});
