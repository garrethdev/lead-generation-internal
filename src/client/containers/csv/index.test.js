import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import CSVUpload from './index';
import SpinnerLoader from '../../components/spinnerLoader';

const initialState = { output: 100 };

describe('>>>>> CSV Upload --- Shallow render react component', () => {
  const mockStore = configureStore();
  let store; let wrapper; let
    csvUpload;

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><CSVUpload /></Provider>);
    csvUpload = wrapper.find('CSVUpload');
  });

  it('on change input csv', () => {
    const fileContents = 'Email Address,First Name,Last Name,Company\n'
      + 'phpatel.4518@gmail.com,Pooja,Patel,ABC\n'
      + 'patelpooja300876@gmail.com,Patel,Pooja,DEF';
    const expectedFinalState = { fileContents };
    const file = new Blob([fileContents], { type: 'text/plain' });
    const readAsText = jest.fn();
    const addEventListener = jest.fn((_, evtHandler) => { evtHandler(); });
    const dummyFileReader = { addEventListener, readAsText, result: fileContents };
    window.FileReader = jest.fn(() => dummyFileReader);

    csvUpload.find('#csv-input').simulate('change', { target: { files: [file] } });

    expect(FileReader).toHaveBeenCalled();
    expect(readAsText).toHaveBeenCalledWith(file);
  });

  it('on upload member button clicked', () => {
    const uploadButton = csvUpload.find('#button-upload-member');
    expect(uploadButton).toHaveLength(2);
    uploadButton.at(0).simulate('click');
  });

  it('on send button clicked', () => {
    const sendButton = csvUpload.find('#button-send');
    expect(sendButton).toHaveLength(2);
    sendButton.at(0).simulate('click');
  });

  it('on schedule button clicked', () => {
    const scheduleButton = csvUpload.find('#button-schedule');
    expect(scheduleButton).toHaveLength(2);
    scheduleButton.at(0).simulate('click');
  });

  it('should contain loader component', () => {
    shallow(<SpinnerLoader />);
    expect(csvUpload.find('SpinnerLoader')).toHaveLength(1);
  });
});
