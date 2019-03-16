import React from 'react';
import {
  Button, Col, Input, Row
} from 'reactstrap';
import DateTime from 'react-datetime';
import moment from 'moment';
import Calendar from 'react-calendar';
import './schedule.css';

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
    this.setState({ [name]: value, errorMessage: '' });
  };

  handleBlurEvent = (e) => {
    const { value } = e.target;
    if (!value) {
      this.setState({ errorMessage: 'Please add subject.' });
    }
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
      this.setState({ errorMessage: 'Please add subject.' });
      return;
    }
    handleNext && handleNext(component.title, { scheduleDate, subjectLine });
  };

  render() {
    const { scheduleDate, subjectLine, errorMessage } = this.state;
    const { component } = this.props;
    return (
      <div className="container">
        <Row>
          <Col md={7}>
            <div>
              <label>Subject</label>
              <Input type="text" name="subjectLine" id="subjectLine" placeholder="Add the subject for your campaign" value={subjectLine} onBlur={this.handleBlurEvent} onChange={this.handleChange} required />
            </div>
            { errorMessage ? <span className="error">{errorMessage}</span> : '' }
            <div>
              <label>Calendar</label>
              <Calendar
                onChange={value => this.setState({ scheduleDate: moment(this.state.scheduleDate).year(value.getFullYear()).month(value.getMonth()).date(value.getDate()) })}
                value={moment(scheduleDate).toDate()}
                minDate={new Date()}
              />
            </div>
            <div>
              <label>Date</label>
              <DateTime
                value={scheduleDate}
                inputProps={{ readOnly: true }}
                isValidDate={this.getValidDates}
                timeConstraints={this.getValidTimes(scheduleDate)}
                onChange={this.handleScheduleDate}
                dateFormat="MMMM DD, YYYY"
                timeFormat={false}
                closeOnSelect
                closeOnTab
              />
            </div>
            <div>
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
            </div>
          </Col>
        </Row>
        <div className="btn-next">
          <Button className="btn btn-primary" color="primary" id="button-add-campaign" onClick={this.handleNext}>
            {component.butttonTitle}
          </Button>
        </div>
      </div>
    );
  }
}
