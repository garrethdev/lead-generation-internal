import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Button } from 'reactstrap';

class Route404 extends React.Component {
  render() {
    const { goToHome } = this.props;

    return (
      <div className="container">
        <div className="label-wrapper">
          <h3 className="text-center mt-5">Looks like this page does not exist!!!!</h3>
          <br />
          <Button type="submit" id="submit-button" className="w-25 mt-2 m-auto d-block" onClick={goToHome}>Go to Home</Button>
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
