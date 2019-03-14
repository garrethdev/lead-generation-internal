import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Button } from 'reactstrap';
import DateTime from 'react-datetime';
import moment from 'moment';
import { addMailChimpCampaign, updateCampaignContent } from '../../modules/mailChimp';

const minuteInterval = 15;
const roundedUp = Math.ceil(moment().minute() / minuteInterval) * minuteInterval;

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectLine: '',
      previewText: '',
      scheduleDate: moment().minute(roundedUp),
      uploadingData: false
    };
  }

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
    const { scheduleDate } = this.state;
    const { component, handleNext } = this.props;
    handleNext && handleNext(component.title, scheduleDate);
  };

  render() {
    const { scheduleDate, uploadingData } = this.state;
    const { component } = this.props;
    return (
      <div className="container">
        <DateTime
          value={scheduleDate}
          inputProps={{ readOnly: true }}
          isValidDate={this.getValidDates}
          timeConstraints={this.getValidTimes(scheduleDate)}
          onChange={this.handleScheduleDate}
          dateFormat="MMMM DD YYYY,"
          closeOnSelect
          closeOnTab
        />
        <br />
        <Button className="btn btn-primary" color="primary" id="button-add-campaign" onClick={this.handleNext}>
          {component.butttonTitle}
        </Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addMailChimpCampaign,
  updateCampaignContent,
  gotoAddTemplate: id => push('/uploadCSV', { id })
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Schedule);
