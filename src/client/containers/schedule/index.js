import React from 'react';
import {
  Button, Col, Form, FormGroup, Input
} from 'reactstrap';
import DateTime from 'react-datetime';
import moment from 'moment';
import Calendar from 'react-calendar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateNewCampaign } from '../../modules/mailChimp';

import './schedule.css';

const minuteInterval = 15;

class Schedule extends React.Component {
  state = { subjectLine: '' };

  componentDidMount() {
    const { campaignDetails: { scheduleDate }, updateNewCampaign } = this.props;
    const date = scheduleDate || moment();
    const roundedUp = Math.ceil(moment(date).minute() / minuteInterval) * minuteInterval;
    updateNewCampaign({ scheduleDate: moment(date).minute(roundedUp) });
  }

  handleSubjectChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleBlurEvent = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { subjectLine } = this.state;
    const { updateNewCampaign } = this.props;
    updateNewCampaign({ subjectLine });
  };

  handleScheduleDate = (date) => {
    const { updateNewCampaign } = this.props;
    updateNewCampaign({ scheduleDate: date });
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

  handleNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { handleNext } = this.props;
    handleNext();
  };

  render() {
    const roundedUp = Math.ceil(moment().minute() / minuteInterval) * minuteInterval;
    const defaultDate = moment().minute(roundedUp);
    const { campaignDetails: { scheduleDate = defaultDate, subjectLine } } = this.props;
    return (
      <div className="container">
        <Form onSubmit={this.handleNext}>
          <FormGroup row>
            <Col md={7}>
              <div>
                <label>Subject</label>
                <Input type="text" name="subjectLine" id="subjectLine" placeholder="Add the subject for your campaign" defaultValue={subjectLine} onBlur={this.handleBlurEvent} onChange={this.handleSubjectChange} required />
              </div>
              <div>
                <label>Calendar</label>
                <Calendar
                  onChange={(value) => {
                    this.handleScheduleDate(moment(scheduleDate).year(value.getFullYear()).month(value.getMonth()).date(value.getDate()));
                  }}
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
          </FormGroup>
          <div className="btn-next">
            <Button type="submit" className="btn btn-primary" color="primary" id="button-add-campaign">
              {'Next'}
            </Button>
          </div>
        </Form>
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
)(Schedule);
