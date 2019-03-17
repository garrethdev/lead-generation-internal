import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Alert, Button, Col, FormGroup, Input, Label, Row, Tooltip
} from 'reactstrap';
import csv from 'csvtojson';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import { addMembers, getLists } from '../../modules/mailChimp';

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
          this.setState({ existingLists: _.map(lists, l => _.pick(l, ['id', 'name', 'campaign_defaults'])), selectedListIndex: 0 });
        }
      })
      .catch(error => console.log('Error retriving lists', error))
      .finally(() => showLoader(false));
  }

  handleList = selectedListIndex => this.setState({ selectedListIndex });

  onDropFile = (files) => {
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

  handleMenbersUpload = () => {
    const { csvContent, existingLists, selectedListIndex } = this.state;
    const { addMembers, showLoader } = this.props;
    if (!csvContent) return;
    if (selectedListIndex === null) {
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
              this.setState({ enableSend: true, showAlert: 'Uploaded Successfully!!!' }, () => {
                setTimeout(() => this.setState({ showAlert: false }), 3000);
              });
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
    if (selectedListIndex === null) return;
    if (!enableSend) return;
    handleNext && handleNext(component.title, existingLists[selectedListIndex]);
  };

  render() {
    const {
      enableUpload, enableSend, selectedFileName, existingLists, selectedListIndex, showAlert, csvError
    } = this.state;
    const { component } = this.props;
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
                  <Dropzone
                    id="csv-input"
                    accept=".csv,text/csv"
                    multiple={false}
                    onDrop={this.onDropFile}
                    isDragActive
                  >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                      <div className="dropzone" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p style={selectedFileName ? { color: 'black' } : { color: 'gray' }}>{selectedFileName || 'Drop in contact list'}</p>
                      </div>
                    )}
                  </Dropzone>
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
                id="Tooltip-1"
                color="dark"
                onClick={this.handleMenbersUpload}
                className="upload-btn"
              >
                {
                  !enableUpload
                  && (
                    <Tooltip placement="top" isOpen={this.state.tooltipOpen1} target="Tooltip-1" toggle={() => this.setState({ tooltipOpen1: !this.state.tooltipOpen1 })}>
                      Please add csv first!
                    </Tooltip>
                  )
                }
                Upload
              </Button>
            </Col>
          </Row>
        </div>
        <div className="btn-next">
          <Button id="Tooltip-2" className="btn btn-primary" color="primary" onClick={this.handleNext}>
            {
              !(enableUpload && enableSend)
              && (
                <Tooltip placement="top" isOpen={this.state.tooltipOpen2} target="Tooltip-2" toggle={() => this.setState({ tooltipOpen2: !this.state.tooltipOpen2 })}>
                  Please upload csv first!
                </Tooltip>
              )
            }
            {component ? component.butttonTitle : ''}
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
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getLists,
  addMembers
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CSVUpload);
