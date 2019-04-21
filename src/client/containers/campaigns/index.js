import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Alert, Button, Col, FormGroup, Input, Row, Label, Spinner
} from 'reactstrap';
import moment from 'moment';
import { sendCampaign, updateSelectedList } from '../../modules/mailChimp';
import AddCampaign from './addCampaign';

import './campaign.css';

class Campaigns extends React.Component {
  state = {
    isLoading: false,
    campaigns: [],
    modal: false
  };

  showLoader = (loading = false) => this.setState({ isLoading: loading });

  handleList = (list) => {
    const { updateSelectedList } = this.props;
    updateSelectedList(list);
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  onAddCampaign = (campaign) => {
    const { campaigns } = this.state;
    this.setState({ campaigns: [...campaigns, campaign] }, () => {
      this.toggle();
    });
  };

  removeCampaign = (index) => {
    const { campaigns } = this.state;
    campaigns.splice(index, 1);
    this.setState({ campaigns });
  };

  scheduleCampaigns = () => {
    const { campaigns } = this.state;
    const { sendCampaign } = this.props;
    // @TODO: schedule with Promise.all? or use batch update (check sendCampaign method first)
    const campaignCreatePromises = campaigns.map(sendCampaign);
    this.showLoader(true);
    Promise.all(campaignCreatePromises)
      .then((response) => {
        this.showLoader(false);
        this.setState({
          showAlert: 'Scheduled Successfully!!!'
        }, () => {
          this.showLoader(false);
          setTimeout(() => this.setState({ showAlert: false }), 3000);
        });
      })
      .catch((error) => {
        this.setState({
          showAlert: 'Error'
        }, () => {
          this.showLoader(false);
          setTimeout(() => this.setState({ showAlert: false }), 3000);
        });
        console.log('error scheduling campaigns', error);
        this.showLoader(false);
      });
  };

  renderCampaigns = () => {
    const { campaigns, isLoading } = this.state;
    if (campaigns.length > 0) {
      // @TODO: add html content to display template
      return (
        <div>
          {
            campaigns.map((c, i) => (
              <div>
                <Row className="campaign-container" key={i.toString()}>
                  <Col md={2}>
                    <div className="template-wrapper" dangerouslySetInnerHTML={{ __html: c.html }} />
                  </Col>
                  <Col md={8}>
                    <Label>{c.subjectLine}</Label>
                    <br />
                    <Label>{`${moment(c.scheduleDate).format('DD MMMM YYYY')} at ${moment(c.scheduleDate).format('hh:mm a')}`}</Label>
                  </Col>
                  <div>
                    <Col md={2}>
                      <Button
                        color="danger"
                        onClick={() => this.removeCampaign(i)}
                      >
                        cancel
                      </Button>
                    </Col>
                  </div>
                </Row>
                <hr className="style1" />
              </div>
            ))
          }
          <div className="schedule-btn">
            <Button
              color="primary"
              onClick={this.scheduleCampaigns}
            >
              Schedule
            </Button>
            {isLoading && <Spinner style={{ width: '2rem', height: '2rem', marginLeft: 20 }} />}
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        No campaigns added
      </div>
    );
  };

  render() {
    const { modal, showAlert } = this.state;
    const { lists = [], selectedList: { id = '', stats: { member_count: memberCount = 0 } = {} } = {} } = this.props;
    return (
      <div className="container">
        <div className="component-wrapper">
          <FormGroup>
            <Row>
              <Col md={9}>
                <Label>Contact List</Label>
                <Input
                  className="list-input"
                  type="select"
                  name="select"
                  id="exampleSelect"
                  defaultValue={id}
                  onChange={(event) => {
                    const { value } = event.target;
                    const index = lists.findIndex(l => l.id === value);
                    this.handleList(lists[index]);
                  }}
                >
                  {
                    lists.map((l, i) => <option value={l.id} key={l.id}>{l.name}</option>)
                  }
                </Input>
                <Label>{`${memberCount} contacts available`}</Label>
              </Col>
              <Col md={3}>
                <Button
                  color="dark"
                  onClick={this.toggle}
                >
                  Add campaign
                </Button>
              </Col>
            </Row>
          </FormGroup>
          <div>
            {this.renderCampaigns()}
          </div>
        </div>
        <Alert className={showAlert === 'Error' ? 'danger' : 'success-alert'} color="success" isOpen={!!showAlert} toggle={() => this.setState({ showAlert: false })}>
          {showAlert}
        </Alert>
        <AddCampaign modalOpen={modal} toggleModal={this.toggle} addCampaign={this.onAddCampaign} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lists: state.mailchimp && state.mailchimp.lists,
  selectedList: state.mailchimp && state.mailchimp.selectedList,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  sendCampaign,
  updateSelectedList
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Campaigns);
