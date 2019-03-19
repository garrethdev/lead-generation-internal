import React from 'react';
import renderHTML from 'react-render-html';
import DateTime from 'react-datetime';
import { Alert, Button } from 'reactstrap';
import moment from 'moment';

import './recap.css';

const minuteInterval = 15;
const roundedUp = Math.ceil(moment().minute() / minuteInterval) * minuteInterval;

export default class Recap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleDate: moment().minute(roundedUp),
      showAlert: false
    };
  }

  handleNext = () => {
    const { component, handleNext, campaignDetails } = this.props;
    const {
      listDetails, html, scheduleDate, subjectLine
    } = campaignDetails;
    if (listDetails && html && scheduleDate && subjectLine) {
      this.setState({ showErrors: false }, () => {
        handleNext && handleNext(component.title);
      });
    } else {
      this.setState({ showAlert: 'Add all the details first', showErrors: true });
    }
  };

  editTemplate = () => {
    const { editTemplate } = this.props;
    editTemplate();
  };

  render() {
    const { showAlert } = this.state;
    const { campaignDetails, component } = this.props;
    const {
      listDetails, html = '', scheduleDate = moment.now(), subjectLine = ''
    } = campaignDetails;
    const { name = '' } = listDetails || {};
    return (
      <div className="container">
        <label>Subject</label>
        <div className="name">
          <label>{subjectLine}</label>
        </div>
        <label>Template</label>
        <div className="template-wrapper" onClick={this.editTemplate}>
          {renderHTML(html)}
        </div>
        <label>Date</label>
        <DateTime
          value={scheduleDate}
          inputProps={{ readOnly: true, disabled: true }}
          onChange={this.handleScheduleDate}
          dateFormat="MMMM DD, YYYY"
          timeFormat={false}
          closeOnSelect
          closeOnTab
        />
        <label>Time</label>
        <DateTime
          value={scheduleDate}
          inputProps={{ readOnly: true, disabled: true }}
          onChange={this.handleScheduleDate}
          dateFormat={false}
          closeOnSelect
          closeOnTab
        />
        <label>List</label>
        <div className="name">
          <label>{name}</label>
        </div>
        <br />
        <div className="btn-next">
          <Button className="btn btn-primary" color="primary" id="button-add-campaign" onClick={this.handleNext}>
            {component.butttonTitle}
          </Button>
        </div>
        <Alert className="success-alert" color="danger" isOpen={!!showAlert} toggle={() => this.setState({ showAlert: false })}>
          {showAlert}
        </Alert>
      </div>
    );
  }
}
