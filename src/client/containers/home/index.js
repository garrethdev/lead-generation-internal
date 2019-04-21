import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';

import NavigationBar from '../navigationBar';
import './home.css';

class Home extends React.Component {
  render() {
    const { goToDashboard } = this.props;

    return (
      <div>
        <div className="container">
          <div className="label-wrapper">
            <label className="links" onClick={goToDashboard}>New Campaign</label>
            <br />
            <label className="links" onClick={() => console.log('Ongoing Campaign')}>Ongoing Campaign</label>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth && state.auth.user });

const mapDispatchToProps = dispatch => bindActionCreators({
  goToNewCampaign: () => push('/newCampaign'),
  goToDashboard: () => push('/dashboard')
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
