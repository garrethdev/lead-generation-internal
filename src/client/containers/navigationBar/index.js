import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import { logOutUser } from '../../modules/auth';

import './navigationBar.css';

class NavigationBar extends React.Component {
  render() {
    const { logOutUser } = this.props;
    return (
      <div>
        <label className="tag-line">Incertae.io Lead Generation Platform</label>
        <Button className="log-out" outline color="secondary" id="log-out" onClick={logOutUser}>
            LOGOUT
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  logOutUser
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(NavigationBar);
