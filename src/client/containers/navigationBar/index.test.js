import React from 'react';
import { shallow } from 'enzyme';
import NavBar from './index';

it('renders NavBar without crashing', () => {
  shallow(<NavBar />);
});
