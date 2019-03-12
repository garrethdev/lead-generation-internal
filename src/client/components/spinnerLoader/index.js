import React from 'react';
import _ from 'lodash';

import './spinnerLoader.css';

const SpinnerLoader = ({ className, style, isVisible }) => {
  const wrapperStyle = _.assign({}, { width: '16px', height: '16px' }, style);
  if (!isVisible) { return null; }
  return (
    <div className="spinner-container">
      <div className={`spinner-rolling spinner-loading ${className}`} style={wrapperStyle}>
        <div />
      </div>
    </div>
  );
};
export default SpinnerLoader;
