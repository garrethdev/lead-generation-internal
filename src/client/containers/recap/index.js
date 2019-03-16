import React from 'react';
import renderHTML from 'react-render-html';
import DateTime from 'react-datetime';
import { Button } from 'reactstrap';
import moment from 'moment';

import './recap.css';

const minuteInterval = 15;
const roundedUp = Math.ceil(moment().minute() / minuteInterval) * minuteInterval;

export default class Recap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleDate: moment().minute(roundedUp),
    };
  }

  handleNext = () => {
    const { component, handleNext } = this.props;
    handleNext && handleNext(component.title);
  };

  getValidDates = (current) => {
    const yesterday = moment().subtract(1, 'day');
    return current.isAfter(yesterday);
  };

  getValidTimes = (dateTime) => {
    // date is today, so only allow future times
    if (moment().isSame(dateTime, 'day')) {
      return {
        hours: { min: dateTime.hours(), max: 23, step: 1 },
        minutes: { min: 0, max: 59, step: minuteInterval },
      };
    }
    // date is in the future, so allow all times
    return {
      hours: { min: 0, max: 23, step: 1 },
      minutes: { min: 0, max: 59, step: minuteInterval },
    };
  };

  editTemplate = () => {
    const { editTemplate } = this.props;
    editTemplate();
  };

  render() {
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
          isValidDate={this.getValidDates}
          timeConstraints={this.getValidTimes(scheduleDate)}
          onChange={this.handleScheduleDate}
          dateFormat={'MMMM DD, YYYY'}
          timeFormat={false}
          closeOnSelect
          closeOnTab
        />
        <label>Time</label>
        <DateTime
          value={scheduleDate}
          inputProps={{ readOnly: true, disabled: true }}
          isValidDate={this.getValidDates}
          timeConstraints={this.getValidTimes(scheduleDate)}
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
      </div>
    );
  }
}
