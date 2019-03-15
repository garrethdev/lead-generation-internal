import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import csv from 'csvtojson';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import { LIST_ID } from '../../helpers/constants';
import {
  addMembers, getLists
} from '../../modules/mailChimp';

import './csv.css';

class CSVUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvContent: null,
      enableUpload: false,
      enableSend: false,
      selectedFileName: undefined,
      existingLists: [],
      selectedListIndex: null
    };
  }

  componentDidMount() {
    const { getLists, showLoader } = this.props;
    showLoader(true);
    getLists()
      .then(({ lists = [] }) => {
        if (lists.length > 0) {
          const currentIndex = _.findIndex(lists, l => l.id === LIST_ID);
          this.setState({ existingLists: _.map(lists, l => _.pick(l, ['id', 'name', 'campaign_defaults'])), selectedListIndex: (currentIndex > -1) ? currentIndex : 0 });
        }
      })
      .catch(error => console.log('Error retriving lists', error))
      .finally(() => showLoader(false));
  }

  handleList = selectedListIndex => this.setState({ selectedListIndex });

  onDropFile = (files) => {
    if (files.length > 1) {
      alert('only one file is allowed');
    } else if (files.length === 1) {
      const fileReader = new FileReader();
      fileReader.readAsText(files[0]);
      fileReader.onloadend = (e) => {
        const headers = e.target.result.split('\n')[0];
        if (headers.includes('Email Address') && headers.includes('First Name') && headers.includes('Last Name') && headers.includes('Company')) {
          this.setState({
            csvContent: e.target.result, enableUpload: true, selectedFileName: files[0].name
          });
        } else {
          alert('Invalid format of CSV, please check and try again.');
        }
      };
    }
  };

  handleMenbersUpload = () => {
    const { csvContent, existingLists, selectedListIndex } = this.state;
    const { addMembers, showLoader } = this.props;
    if (!csvContent) {
      alert('Please select file first.');
    } else if (selectedListIndex === null) {
      alert('No List Selected');
    } else {
      showLoader(true);
      const listID = existingLists[selectedListIndex];
      csv().fromString(csvContent)
        .then((fetchedMembers) => {
          const members = fetchedMembers.map(m => ({
            method: 'post',
            path: `/lists/${listID}/members`,
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
            .then(() => {
              // @TODO : enable send button
              this.setState({ enableSend: true });
            })
            .catch((error) => {
              console.log('error uploading csv data', error);
              alert('error uploading csv data');
            })
            .finally(() => showLoader(false));
        })
        .catch((error) => {
          console.log('Error while reading csv file', error);
          alert('Error while reading csv file, please try again.');
          showLoader(false);
        });
    }
  };

  handleNext = () => {
    const { enableSend, existingLists, selectedListIndex } = this.state;
    const { component, handleNext } = this.props;
    if (selectedListIndex === null) {
      alert('No List selected');
    } else if (!enableSend) {
      alert('Please upload the contact first.');
    } else {
      handleNext && handleNext(component.title, existingLists[selectedListIndex]);
    }
  };

  render() {
    const {
      enableUpload, selectedFileName, existingLists, selectedListIndex
    } = this.state;
    const { component } = this.props;
    return (
      <div className="container">
        <div className="component-wrapper">
        Upload Contact List
          <div className="list-input">
            <div className="list-name">
              <p>{(selectedListIndex !== null) ? existingLists[selectedListIndex].name : ''}</p>
            </div>
            <Button color="secondary" disabled={!enableUpload} onClick={this.handleMenbersUpload}>Upload</Button>
          </div>
          <div>
            <Dropzone
              accept=".csv,text/csv"
              onDrop={this.onDropFile}
              onDropRejected={() => alert('Invalid format of CSV, please check and try again.')}
            >
              {({ getRootProps }) => (
                <div className="dropzone" {...getRootProps()}>
                  <p style={selectedFileName ? { color: 'black' } : { color: 'gray' }}>{selectedFileName || 'Drop in contact list'}</p>
                </div>
              )}
            </Dropzone>
          </div>
          <br />
          Existing List
          <div className="list-name">
            {
              existingLists.map((l, i) => <div className={(selectedListIndex === i) ? 'selected-list-item' : 'list-item'} key={l.id} onClick={() => this.handleList(i)}>{l.name}</div>)
            }
          </div>
        </div>
        <Button className="btn btn-primary nxt-btn" color="primary" id="button-add-campaign" onClick={this.handleNext}>
          {component.butttonTitle}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lists: state.mailchimp && state.mailchimp.lists,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getLists,
  addMembers
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CSVUpload);
