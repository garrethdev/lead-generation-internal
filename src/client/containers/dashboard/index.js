import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateNewCampaign } from '../../modules/mailChimp';
import NavigationBar from '../navigationBar';

class Dashboard extends React.Component {
  render() {
    return (
      <div className="container">
        Dashboard
      </div>
    );
  }
}

const mapStateToProps = state => ({
  campaignDetails: state.mailchimp && state.mailchimp.campaignDetails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateNewCampaign
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
