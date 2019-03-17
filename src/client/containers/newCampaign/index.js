import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Alert } from 'reactstrap';
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
      campaignDetails: {
        listDetails: undefined,
        html: undefined,
        htmlDesign: undefined,
        scheduleDate: undefined,
        subjectLine: undefined,
      }
    };
  }

  sendCampaign = () => {
    const {
      addMailChimpCampaign,
      updateCampaignContent,
      scheduleCampaign,
    } = this.props;
    const {
      listDetails, html, scheduleDate, subjectLine
    } = this.state.campaignDetails;
    debugger;
    // create campaign, update, send
    const body = {
      recipients: { list_id: listDetails.id },
      type: 'regular',
      settings: {
        subject_line: subjectLine || listDetails.campaign_defaults.subject || 'Hello There,',
        reply_to: listDetails.campaign_defaults.from_email,
        from_name: listDetails.campaign_defaults.from_name
      }
    };

    this.showLoader(true);
    addMailChimpCampaign(body)
      .then(({ id }) => {
        updateCampaignContent(id, { html })
          .then(() => {
            scheduleCampaign(id, scheduleDate)
              .then(() => {
                this.setState({ currentComponentIndex: 0, enableSend: true, showAlert: 'Successfully Scheduled!!!' }, () => {
                  setTimeout(() => this.setState({ showAlert: false }), 3000);
                });
                this.showLoader(false);
              })
              .catch((error) => {
                this.showLoader(false);
                console.log('Error scheduling campaign', error);
                alert('Error scheduling campaign, Please try again.');
              });
          })
          .catch((error) => {
            this.showLoader(false);
            console.log('Error uploading template', error);
            alert('Error uploading template, Please try again.');
          });
      })
      .catch((error) => {
        this.showLoader(false);
        console.log('Error adding campaign', error);
        alert('Error adding campaign, Please try again.');
      });
  };

  handleNext = (componentTitle, value) => {
    const { currentComponentIndex } = this.state;
    const campaignDetails = { ...this.state.campaignDetails };
    switch (componentTitle) {
      case CONTACT_LIST:
        campaignDetails.listDetails = value;
        break;
      case TEMPLATE:
        campaignDetails.html = value.html;
        campaignDetails.htmlDesign = value.htmlDesign;
        break;
      case SCHEDULING:
        campaignDetails.scheduleDate = value.scheduleDate;
        campaignDetails.subjectLine = value.subjectLine;
        break;
      case RECAP:
        this.sendCampaign();
        break;
      default:
        break;
    }
    this.setState({
      campaignDetails,
      currentComponentIndex: (componentDetails.length - 1 > currentComponentIndex) ? currentComponentIndex + 1 : currentComponentIndex
    });
  };

  editTemplate = () => {
    this.setState({ currentComponentIndex: 1 }); // 1 is template index
  };

  showLoader = (show = false) => this.setState({ uploadingData: show });

  render() {
    const {
      componentDetails, currentComponentIndex, uploadingData, campaignDetails, showAlert
    } = this.state;
    const currentComponent = componentDetails[currentComponentIndex];
    return (
      <div className="main-wrapper">
        <label onClick={() => console.log('Ongoing Campaign')}>{`New Campaign ~ ${currentComponent.title}`}</label>
        <div className="tab">
          <ul className="tabs">
            {
              componentDetails.map((c, i) => {
                if (i === currentComponentIndex && i === (componentDetails.length - 1)) {
                  return <li key={i.toString()}><span className="active last" /></li>;
                }
                if (i === currentComponentIndex) {
                  return <li key={i.toString()}><span className="active" /></li>;
                }
                if (i === (componentDetails.length - 1)) {
                  return <li key={i.toString()}><span className="last" /></li>;
                }
                return <li key={i.toString()}><span /></li>;
              })
            }
          </ul>
        </div>
        <div className="component-wrapper">
          {React.createElement(currentComponent.component, {
            component: currentComponent,
            campaignDetails,
            handleNext: this.handleNext,
            editTemplate: this.editTemplate,
            showLoader: this.showLoader
          })}
        </div>
        <Alert className="success-alert" color="success" isOpen={!!showAlert} toggle={() => this.setState({ showAlert: false })}>
          {showAlert}
        </Alert>
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
