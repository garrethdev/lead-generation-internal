import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { addMailChimpCampaign, updateCampaignContent, scheduleCampaign } from '../../modules/mailChimp';

import './newCampaign.css';

import ContactList from '../csv';
import Template from '../template';
import Schedule from '../schedule';
import Recap from '../recap';

import SpinnerLoader from '../../components/spinnerLoader';

const CONTACT_LIST = 'Contact List';
const TEMPLATE = 'Template';
const SCHEDULING = 'Scheduling';
const RECAP = 'Recap';

const componentDetails = [
  {
    title: CONTACT_LIST,
    component: ContactList,
    butttonTitle: 'Next'
  },
  {
    title: TEMPLATE,
    component: Template,
    butttonTitle: 'Next'
  },
  {
    title: SCHEDULING,
    component: Schedule,
    butttonTitle: 'Next'
  },
  {
    title: RECAP,
    component: Recap,
    butttonTitle: 'Schedule'
  },
];

class NewCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentDetails,
      currentComponentIndex: 0,
      uploadingData: false,
      listDetails: undefined,
      html: undefined,
      scheduleDate: undefined,
    };
  }

  sendCampaign = () => {
    const {
      addMailChimpCampaign,
      updateCampaignContent,
      scheduleCampaign,
    } = this.props;
    const { listDetails, html, scheduleDate } = this.state;
    debugger;
    // create campaign, update, send
    const body = {
      recipients: { list_id: listDetails.id },
      type: 'regular',
      settings: {
        subject_line: listDetails.campaign_defaults.subject || 'Hello There,',
        reply_to: listDetails.campaign_defaults.from_email,
        from_name: listDetails.campaign_defaults.from_name
      }
    };

    addMailChimpCampaign(body)
      .then(({ id }) => {
        debugger;
        updateCampaignContent(id, { html })
          .then(() => {
            scheduleCampaign(id, scheduleDate)
              .then((res) => {
                debugger;
              })
              .catch((error) => {
                debugger;
                this.setState({ uploadingData: false });
                console.log('Error scheduling campaign', error);
                alert('Error scheduling campaign, Please try again.');
              });
          })
          .catch((error) => {
            debugger;
            this.setState({ uploadingData: false });
            console.log('Error uploading template', error);
            alert('Error uploading template, Please try again.');
          });
      })
      .catch((error) => {
        debugger;
        this.setState({ uploadingData: false });
        console.log('Error adding campaign', error);
        alert('Error adding campaign, Please try again.');
      });
  };

  handleNext = (componentTitle, value) => {
    switch (componentTitle) {
      case CONTACT_LIST:
        this.setState({ listDetails: value });
        break;
      case TEMPLATE:
        this.setState({ html: value });
        break;
      case SCHEDULING:
        this.setState({ scheduleDate: value });
        break;
      case RECAP:
        this.sendCampaign();
        break;
      default:
        break;
    }
    const { currentComponentIndex } = this.state;
    if (componentDetails.length > currentComponentIndex) {
      this.setState({ currentComponentIndex: currentComponentIndex + 1 });
    }
  };

  showLoader = (show = false) => this.setState({ uploadingData: show });

  render() {
    const {
      componentDetails, currentComponentIndex, uploadingData, listDetails, html, scheduleDate
    } = this.state;
    const currentComponent = componentDetails[currentComponentIndex];
    const campaignDetails = { listDetails, html, scheduleDate };

    return (
      <div className="container">
        <label onClick={() => console.log('Ongoing Campaign')}>{`New Campaign ~ ${currentComponent.title}`}</label>
        <div className="component-wrapper">
          {React.createElement(currentComponent.component, {
            component: currentComponent,
            campaignDetails,
            handleNext: this.handleNext,
            showLoader: this.showLoader
          })}
        </div>
        <SpinnerLoader isVisible={uploadingData} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth && state.auth.user });

const mapDispatchToProps = dispatch => bindActionCreators({
  addMailChimpCampaign,
  updateCampaignContent,
  scheduleCampaign,
  goToHome: () => push('/')
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCampaign);
