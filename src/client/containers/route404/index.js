import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Button } from 'reactstrap';

import './route404.css';

class Route404 extends React.Component {
  render() {
    const { goToHome } = this.props;

    return (
      <div className="container">
        <div className="label-wrapper">
          <h3>Looks like this page does not exist!!!!</h3>
          <br />
          <Button className="go-home" color="primary" onClick={goToHome}>Go to Home</Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  goToHome: () => push('/')
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Route404);
