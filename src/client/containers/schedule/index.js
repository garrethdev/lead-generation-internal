import React from 'react';
import { Button, Input } from 'reactstrap';
import DateTime from 'react-datetime';
import moment from 'moment';

const minuteInterval = 15;
const roundedUp = Math.ceil(moment().minute() / minuteInterval) * minuteInterval;

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectLine: props.campaignDetails ? props.campaignDetails.subjectLine : '',
      scheduleDate: props.campaignDetails ? moment(props.campaignDetails.scheduleDate).minute(roundedUp) : moment().minute(roundedUp),
      uploadingData: false
    };
  }

  handleChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleScheduleDate = date => this.setState({ scheduleDate: date });

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

  handleNext = () => {
    const { scheduleDate, subjectLine } = this.state;
    const { component, handleNext } = this.props;
    if (!subjectLine) {
      alert('please add subject');
    } else {
      handleNext && handleNext(component.title, { scheduleDate, subjectLine });
    }
  };

  render() {
    const { scheduleDate, uploadingData, subjectLine } = this.state;
    const { component } = this.props;
    return (
      <div className="container">
          <label>Subject</label>
        <div className="date-format">
          <Input type="text" name="subjectLine" id="subjectLine" placeholder="Add the subject for your campaign" value={subjectLine} onChange={this.handleChange} required />
        </div>
          <label>Date</label>
        <DateTime
          value={scheduleDate}
          inputProps={{ readOnly: true }}
          isValidDate={this.getValidDates}
          timeConstraints={this.getValidTimes(scheduleDate)}
          onChange={this.handleScheduleDate}
          timeFormat={false}
          closeOnSelect
          closeOnTab
        />
          <label>Time</label>
        <DateTime
          value={scheduleDate}
          inputProps={{ readOnly: true }}
          isValidDate={this.getValidDates}
          timeConstraints={this.getValidTimes(scheduleDate)}
          onChange={this.handleScheduleDate}
          dateFormat={false}
          closeOnSelect
          closeOnTab
        />
        <br />
        <Button className="btn btn-primary nxt-btn" color="primary" id="button-add-campaign" onClick={this.handleNext}>
          {component.butttonTitle}
        </Button>
      </div>
    );
  }
}
