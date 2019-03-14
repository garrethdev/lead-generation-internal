import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import Campaigns from './index';
import SpinnerLoader from '../../components/spinnerLoader';

const initialState = { output:100 };

describe('>>>>> Campaigns --- Shallow render react component', () => {
  const mockStore = configureStore();
  let store, wrapper, campaigns;

  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = mount(<Provider store={store}><Campaigns /></Provider>);
    campaigns = wrapper.find('Campaigns');
  });

  it('on change subject line', () => {
    const subjectLine = campaigns.find('#subject-line');
    expect(subjectLine).toHaveLength(2);
    subjectLine.at(0).simulate('change', { target: { name: 'subjectLine', value: 'Test Subject line' } });
    expect(campaigns.instance().state.subjectLine).toEqual('Test Subject line');
  });

  it('on change subject line', () => {
    const subjectLine = campaigns.find('#subject-line');
    expect(subjectLine).toHaveLength(2);
    subjectLine.at(0).simulate('change', { target: { name: 'subjectLine', value: 'Test Subject line' } });
    expect(campaigns.instance().state.subjectLine).toEqual('Test Subject line');
  });

  it('on change preview text', () => {
    const previewText = campaigns.find('#preview-text');
    expect(previewText).toHaveLength(2);
    previewText.at(0).simulate('change', { target: { name: 'previewText', value: 'This is preview text for testing.' } });
    expect(campaigns.instance().state.previewText).toEqual('This is preview text for testing.');
  });

  it('on change reply to', () => {
    const replyTo = campaigns.find('#reply-to');
    expect(replyTo).toHaveLength(2);
    replyTo.at(0).simulate('change', { target: { name: 'replyTo', value: 'admin@gmail.com' } });
    expect(campaigns.instance().state.replyTo).toEqual('admin@gmail.com');
  });

  it('on change from name', () => {
    const fromName = campaigns.find('#from-name');
    expect(fromName).toHaveLength(2);
    fromName.at(0).simulate('change', { target: { name: 'fromName', value: 'admin' } });
    expect(campaigns.instance().state.fromName).toEqual('admin');
  });

  it('on add campaign button clicked', () => {
    const addCampaignButton = campaigns.find('#button-add-campaign');
    expect(addCampaignButton).toHaveLength(2);
    addCampaignButton.at(0).simulate('click');
  });

  it('should contain loader component', () => {
    shallow(<SpinnerLoader />);
    expect(campaigns.find('SpinnerLoader')).toHaveLength(1);
  });
});
