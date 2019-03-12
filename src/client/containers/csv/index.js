import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Button } from 'reactstrap';
import csv from 'csvtojson';
import DateTime from 'react-datetime';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import moment from 'moment';
import { LIST_ID } from '../../helpers/constants';
import {
  addMembers, sendCampaign, scheduleCampaign, getLists
} from '../../modules/mailChimp';
import SpinnerLoader from '../../components/spinnerLoader';

const minuteInterval = 15;
const roundedUp = Math.ceil(moment().minute() / minuteInterval) * minuteInterval;

class CSVUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignId: props.location ? (props.location.state ? props.location.state.id : '') : '',
      csvContent: null,
      uploadingData: false,
      enableSend: false,
      showScheduleDate: false,
      scheduleDate: moment().minute(roundedUp)
    };
  }

  handleCSVFile = (event) => {
    const csvFile = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsText(csvFile);
    fileReader.onloadend = this.handleFileContent;
  };

  handleFileContent = (e) => {
    this.setState({ csvContent: e.target.result, enableSend: false });
  };

  handleUpload = (id) => {
    const { csvContent } = this.state;
    const { addMembers } = this.props;

    if (!csvContent) {
      alert('Please select file first.');
    } else {
      this.setState({ uploadingData: true });

      csv().fromString(csvContent)
        .then((fetchedMembers) => {
          const members = fetchedMembers.map(m => ({
            method: 'post',
            path: `/lists/${LIST_ID}/members`,
            body: JSON.stringify({
              email_address: m['Email Address'],
              status: 'subscribed',
              merge_fields: {
                FNAME: m['First Name'],
                LNAME: m['Last Name'],
                COMPANY: m.Company
              }
            })
          }));
          addMembers(members)
            .then(() => this.setState({ enableSend: true }))
            .catch((error) => {
              console.log('error uploading csv data', error);
              alert('error uploading csv data');
            })
            .finally(() => {
              this.setState({ uploadingData: false });
            });
        })
        .catch((error) => {
          console.log('Error while reading csv file', error);
          alert('Error while reading csv file, please try again.');
          this.setState({ uploadingData: false });
        });
    }
  };

  sendCampaignNow = () => {
    const { campaignId } = this.state;
    const {
      sendCampaign, gotoHomePage
    } = this.props;
    this.setState({ uploadingData: true });
    sendCampaign(campaignId)
      .then(() => {
        alert('campaign sent successfully!!!');
        gotoHomePage();
      })
      .catch((error) => {
        console.log('Error sending mail', error);
        alert('Error sending mail, Please try again.');
      })
      .finally(() => this.setState({ uploadingData: false }));
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

  scheduleCampaign = () => {
    const { campaignId, scheduleDate } = this.state;
    const { scheduleCampaign, gotoHomePage } = this.props;
    if (moment().isAfter(scheduleDate)) {
      alert('please select valid time');
      return;
    }
    const sendOn = moment.utc(scheduleDate).format();
    this.setState({ uploadingData: true });
    scheduleCampaign(campaignId, sendOn)
      .then(() => {
        alert('campaign has been scheduled!!!');
        gotoHomePage();
      })
      .catch((error) => {
        console.log('Error sending mail', error);
        alert('Error sending mail, Please try again.');
      })
      .finally(() => this.setState({ uploadingData: false }));
  };

  render() {
    const {
      uploadingData, enableSend, scheduleDate, showScheduleDate
    } = this.state;
    return (
      <div className="container">
        <br />
        <input type="file" name="file" id="csv-input" accept=".csv" onChange={this.handleCSVFile} />
        <br />
        <br />
        <Button className="btn btn-primary" id="button-upload-member" color="primary" onClick={this.handleUpload}>Upload Members</Button>
        <br />
        <br />
        {
          showScheduleDate
          && (
            <React.Fragment>
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
            </React.Fragment>
          )
        }
        <Button className="btn btn-primary" color="primary" id="button-send" disabled={!enableSend} onClick={this.sendCampaignNow}>Send now</Button>
        <Button className="btn btn-primary ml-5" color="primary" id="button-schedule" disabled={!enableSend} onClick={showScheduleDate ? this.scheduleCampaign : () => this.setState({ showScheduleDate: true })}>{showScheduleDate ? 'Schedule' : 'Schedule Later'}</Button>
        <br />
        <SpinnerLoader isVisible={uploadingData} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lists: state.mailchimp && state.mailchimp.lists,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getLists,
  addMembers,
  sendCampaign,
  scheduleCampaign,
  gotoHomePage: () => push('/'),
  gotoAddCampaignDetails: () => push('/addCampaignDetails')
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CSVUpload);
