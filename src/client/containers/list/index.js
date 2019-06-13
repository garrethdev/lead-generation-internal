import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button, Col, FormGroup, Input, Label, Spinner, Row, Alert
} from 'reactstrap';
import FileDrop from 'react-file-drop';
import csv from 'csvtojson';
import {
  addMembers, addSingleMember, getLists, updateNewCampaign, updateSelectedList
} from '../../modules/mailChimp';

import './list.css';
import AddMember from './addMember';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvContent: null,
      enableUpload: false,
      selectedFileName: undefined,
      existingLists: [],
      selectedListIndex: null,
      isLoading: false,
      modal: false
    };
  }

  showLoader = (loading = false) => this.setState({ isLoading: loading });

  toggle = () => this.setState({ modal: !this.state.modal });

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

  handleMenbersUpload = () => {
    const { csvContent } = this.state;
    const { addMembers, selectedList } = this.props;
    if (!csvContent) return;
    const { id: listID } = selectedList;
    if (!listID) {
      alert('No list Selected');
    } else {
      this.showLoader(true);
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
              this.setState({
                showAlert: 'Uploaded Successfully!!!', csvContent: null, enableUpload: false, selectedFileName: undefined, csvError: false
              }, () => {
                this.showLoader(false);
                setTimeout(() => this.setState({ showAlert: false }), 3000);
              });
            })
            .catch((error) => {
              this.showLoader(false);
              console.log('error uploading csv data', error);
              alert('error uploading csv data');
            });
        })
        .catch((error) => {
          console.log('Error while reading csv file', error);
          alert('Error while reading csv file, please try again.');
          this.showLoader(false);
        });
    }
  };

  onAddMember = (details) => {
    debugger;
    const { selectedList: { id } } = this.props;
    const body = {
      email_address: details.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: details.firstName,
        LNAME: details.lastName,
        COMPANY: details.companyName
      }
    };

    addSingleMember(id, body)
      .then((response) => {
        debugger;
      })
      .catch((error) => {
        debugger;
      })
      .finally(() => {
        debugger;
      });
    // this.toggle();
  };

  handleList = (list) => {
    const { updateSelectedList } = this.props;
    updateSelectedList(list);
  };

  render() {
    const {
      csvError, enableUpload, isLoading, modal, selectedFileName, showAlert
    } = this.state;
    const { lists = [], selectedList: { id = '', stats: { member_count: memberCount = 0 } = {} } = {} } = this.props;
    return (
      <div className="component-bg-wrapper d-flex align-items-center">
        <div className="component-wrapper">
          <Row>
            <Col md={12}>
              <FormGroup>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="mb-0">Contact List</h3>
                  {isLoading && <Spinner style={{ width: '2rem', height: '2rem', marginLeft: 20 }} />}
                </div>
                <Input
                  className="list-input"
                  type="select"
                  name="select"
                  defaultValue={id}
                  id="exampleSelect"
                  onChange={(event) => {
                    const { value } = event.target;
                    const index = lists.findIndex(l => l.id === value);
                    if (index > -1) { this.handleList(lists[index]); }
                  }}
                >
                  <option disabled value="" key="">Choose from your list</option>
                  {
                    lists.map(l => <option value={l.id} key={l.id}>{l.name}</option>)
                  }
                </Input>
                <div>
                  <label
                    htmlFor="file-input-drop"
                    className={selectedFileName ? 'dropzone' : 'dropzone empty'}
                  >
                    <FileDrop
                      ref={(ref) => { this.dropRedf = ref; }}
                      accept=".csv,text/csv"
                      multiple={false}
                      onDrop={this.onDropFile}
                      className="drop-container"
                    >
                      <p>{selectedFileName || 'Drop in contact list'}</p>
                    </FileDrop>
                    <input type="file" accept=".csv,text/csv" multiple={false} id="file-input-drop" style={{ display: 'none' }} onChange={e => this.onDropFile(e.target.files)} />
                  </label>
                  {
                    csvError && <Label className="error">{csvError}</Label>
                  }
                </div>
              </FormGroup>
            </Col>
          </Row>
          <div className="upload-btn">
            <Button
              onClick={this.handleMenbersUpload}
              disabled={!enableUpload}
              className="btn-orange"
            >
              Upload
            </Button>
          </div>
          <div className="upload-btn">
            <Button
              onClick={this.toggle}
              disabled={!id}
              className="btn-orange"
            >
              Add member
            </Button>
          </div>
        </div>
        <Alert className="success-alert" color="success" isOpen={!!showAlert} toggle={() => this.setState({ showAlert: false })}>
          {showAlert}
        </Alert>
        <AddMember modalOpen={modal} toggleModal={this.toggle} addMember={this.onAddMember} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  campaignDetails: state.mailchimp && state.mailchimp.campaignDetails,
  lists: state.mailchimp && state.mailchimp.lists,
  selectedList: state.mailchimp && state.mailchimp.selectedList,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addMembers,
  addSingleMember,
  getLists,
  updateNewCampaign,
  updateSelectedList
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
