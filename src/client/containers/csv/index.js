import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Alert, Button, Col, FormGroup, Input, Label, Row
} from 'reactstrap';
import csv from 'csvtojson';
import FileDrop from 'react-file-drop';
import _ from 'lodash';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import { addMembers, getLists, updateNewCampaign } from '../../modules/mailChimp';

import './csv.css';

class CSVUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvContent: null,
      enableUpload: false,
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
          this.setState({ existingLists: _.map(lists, l => _.pick(l, ['id', 'name', 'campaign_defaults'])), selectedListIndex: 0 }, this.updateCampaign);
        }
      })
      .catch(error => console.log('Error retriving lists', error))
      .finally(() => showLoader(false));
  }

  handleList = selectedListIndex => this.setState({ selectedListIndex }, this.updateCampaign)

  onDropFile = (files) => {
    if (files[0].type !== 'text/csv') {
      this.setState({
        csvContent: null, enableUpload: false, selectedFileName: undefined, csvError: 'Invalid file type'
      });
      return;
    }
    this.setState({
      csvContent: null, enableUpload: false, selectedFileName: undefined, csvError: false
    }, () => {
      if (files.length > 1) {
        this.setState({ csvError: 'only one file is allowed' });
      } else if (files.length === 1) {
        const fileReader = new FileReader();
        fileReader.readAsText(files[0]);
        fileReader.onloadend = (e) => {
          const headers = e.target.result.split('\n')[0];
          if (headers.includes('Email Address') && headers.includes('First Name') && headers.includes('Last Name') && headers.includes('Company')) {
            this.setState({
              csvContent: e.target.result, enableUpload: true, selectedFileName: files[0].name, csvError: false
            });
          } else {
            this.setState({ csvError: 'Invalid format of CSV, please check and try again.' });
          }
        };
      }
    });
  };

  handleMenbersUpload = (cb, isNext = false) => {
    const { csvContent, existingLists, selectedListIndex } = this.state;
    const { addMembers, showLoader } = this.props;
    if (!csvContent) return;
    if (selectedListIndex === null) {
      alert('No list Selected');
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
              this.setState({ showAlert: 'Uploaded Successfully!!!' }, () => {
                showLoader(false);
                if (isNext) {
                  cb();
                } else {
                  setTimeout(() => this.setState({ enabledUpload: false, showAlert: false }), 3000);
                }
              });
            })
            .catch((error) => {
              showLoader(false);
              console.log('error uploading csv data', error);
              alert('error uploading csv data');
            });
        })
        .catch((error) => {
          console.log('Error while reading csv file', error);
          alert('Error while reading csv file, please try again.');
          showLoader(false);
        });
    }
  };

  updateCampaign = () => {
    const { existingLists, selectedListIndex } = this.state;
    const { updateNewCampaign } = this.props;
    updateNewCampaign({ listDetails: existingLists[selectedListIndex] });
  };

  handleNext = () => {
    const { enableUpload, selectedListIndex } = this.state;
    const { handleNext } = this.props;
    if (selectedListIndex === null) return;
    const cb = () => {
      this.updateCampaign();
      handleNext();
    };

    if (enableUpload) {
      this.handleMenbersUpload(cb, true);
    } else {
      cb();
    }
  };

  render() {
    const {
      enableUpload, selectedFileName, existingLists, selectedListIndex, showAlert, csvError
    } = this.state;
    return (
      <div>
        <div className="component-wrapper">
          <Row>
            <Col md={10}>
              <FormGroup>
                <Label for="exampleSelect">Upload Contact List</Label>
                <Input
                  className="list-input"
                  type="select"
                  name="select"
                  id="exampleSelect"
                  onChange={(event) => {
                    const { value } = event.target;
                    this.handleList(parseInt(value, 10));
                  }}
                >
                  {
                    existingLists.map((l, i) => <option value={i} key={l.id}>{l.name}</option>)
                  }
                </Input>
                <div>
                  <div>
                    <label htmlFor="file-input-drop" className="dropzone">
                      <FileDrop ref={(ref) => { this.dropRedf = ref; }} accept=".csv,text/csv" multiple={false} onDrop={this.onDropFile} className="drop-container">
                        <p style={selectedFileName ? { color: 'black' } : { color: 'gray' }}>{selectedFileName || 'Drop in contact list'}</p>
                      </FileDrop>
                      <input type="file" accept=".csv,text/csv" multiple={false} id="file-input-drop" style={{ display: 'none' }} onChange={e => this.onDropFile(e.target.files)} />
                    </label>
                  </div>
                  {
                    enableUpload && <Label className="note">Note: Click on upload to add contacts.</Label>
                  }
                  {
                    csvError && <Label className="error">{csvError}</Label>
                  }
                </div>
                <br />
                <Label>Existing List</Label>
                <div className="list-name">
                  {
                    existingLists.map((l, i) => <div className={(selectedListIndex === i) ? 'selected-list-item' : 'list-item'} key={l.id}>{l.name}</div>)
                  }
                </div>
              </FormGroup>
            </Col>
            <Col md={2}>
              <Button
                color="dark"
                onClick={this.handleMenbersUpload}
                className="upload-btn"
              >
                Upload
              </Button>
            </Col>
          </Row>
        </div>
        <div className="btn-next">
          <Button className="btn btn-primary" color="primary" onClick={this.handleNext}>
            {'Next'}
          </Button>
        </div>
        <Alert className="success-alert" color="success" isOpen={!!showAlert} toggle={() => this.setState({ showAlert: false })}>
          {showAlert}
        </Alert>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lists: state.mailchimp && state.mailchimp.lists,
  campaignDetails: state.mailchimp && state.mailchimp.campaignDetails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getLists,
  addMembers,
  updateNewCampaign
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CSVUpload);
