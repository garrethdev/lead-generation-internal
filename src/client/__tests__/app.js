import React from 'react';
import { shallow } from 'enzyme';
import App from '../containers/app';

it('renders App without crashing', () => {
  shallow(<App />);
});
