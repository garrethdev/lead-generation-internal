import React from 'react';
import renderHTML from 'react-render-html';
import DateTime from 'react-datetime';
import { Alert, Button } from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { sendCampaign } from '../../modules/mailChimp';

import './recap.css';

class Recap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false
    };
  }

  handleNext = () => {
    const { campaignDetails, sendCampaign, showLoader } = this.props;
    const {
      listDetails, template: { html }, scheduleDate, subjectLine
    } = campaignDetails;
    if (listDetails && html && scheduleDate && subjectLine) {
      this.setState({ showErrors: false }, () => {
        // send Campaign
        showLoader(true);
        sendCampaign()
          .then(() => {
            showLoader(false);
            this.setState({ showAlert: 'Scheduled Successfully!!!', showErrors: true }, () => {
              setTimeout(() => this.setState({ showAlert: false }), 3000);
            });
          })
          .catch((error) => {
            showLoader(false);
            this.setState({ showAlert: error.errorMessage, showErrors: true }, () => {
              setTimeout(() => this.setState({ showAlert: false }), 3000);
            });
          });
        // handleNext(true);
      });
    } else {
      this.setState({ showAlert: 'Add all the details first', showErrors: true }, () => {
        setTimeout(() => this.setState({ showAlert: false }), 3000);
      });
    }
  };

  render() {
    const roundedUp = Math.ceil(moment().minute() / 15) * 15;
    const defaultDate = moment().minute(roundedUp);

    const { showAlert } = this.state;
    const { campaignDetails, editComponent } = this.props;
    const {
      listDetails, template: { html }, scheduleDate = defaultDate, subjectLine
    } = campaignDetails;
    const { name = '' } = listDetails || {};
    return (
      <div className="container">
        Subject
        <div className="name">
          <label>{subjectLine}</label>
        </div>
        Template
        <div onClick={() => editComponent(1)} className="template-wrapper">
          {html && renderHTML(html)}
        </div>
        Date
        <DateTime
          value={scheduleDate}
          inputProps={{ readOnly: true, disabled: true }}
          onChange={this.handleScheduleDate}
          dateFormat="MMMM DD, YYYY"
          timeFormat={false}
          closeOnSelect
          closeOnTab
        />
        Time
        <DateTime
          value={scheduleDate}
          inputProps={{ readOnly: true, disabled: true }}
          onChange={this.handleScheduleDate}
          dateFormat={false}
          closeOnSelect
          closeOnTab
        />
        List
        <div className="name">
          <label>{name}</label>
        </div>
        <br />
        <div className="btn-next">
          <Button className="btn btn-primary" color="primary" id="button-add-campaign" onClick={this.handleNext}>
            {'Schedule'}
          </Button>
        </div>
        <Alert className="success-alert" color={(showAlert === 'Scheduled Successfully!!!') ? 'success' : 'danger'} isOpen={!!showAlert} toggle={() => this.setState({ showAlert: false })}>
          {showAlert}
        </Alert>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  campaignDetails: state.mailchimp && state.mailchimp.campaignDetails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  sendCampaign
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recap);
