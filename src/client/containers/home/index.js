import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import './home.css';

class Home extends React.Component {
  render() {
    const { goToNewCampaign } = this.props;

    return (
      <div className="container">
        <div className="label-wrapper">
          <label className="links" onClick={goToNewCampaign}>New Campaign</label>
          <br />
          <label className="links" onClick={() => console.log('Ongoing Campaign')}>Ongoing Campaign</label>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth && state.auth.user });

const mapDispatchToProps = dispatch => bindActionCreators({
  goToNewCampaign: () => push('/newCampaign')
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
