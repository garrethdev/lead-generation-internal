import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Alert } from 'reactstrap';

import './newCampaign.css';

import ContactList from '../csv';
import Template from '../template';
import Schedule from '../schedule';
import Recap from '../recap';
import NavigationBar from '../navigationBar';

import SpinnerLoader from '../../components/spinnerLoader';

const CONTACT_LIST = 'Contact list';
const TEMPLATE = 'Template';
const SCHEDULING = 'Scheduling';
const RECAP = 'Recap';

const componentDetails = [
  {
    title: CONTACT_LIST,
    component: ContactList
  },
  {
    title: TEMPLATE,
    component: Template
  },
  {
    title: SCHEDULING,
    component: Schedule
  },
  {
    title: RECAP,
    component: Recap
  },
];

class NewCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentDetails,
      currentComponentIndex: 0,
      uploadingData: false
    };
  }

  handleNext = () => {
    const { currentComponentIndex } = this.state;
    this.setState({
      currentComponentIndex: (componentDetails.length - 1 > currentComponentIndex) ? currentComponentIndex + 1 : currentComponentIndex
    });
  };

  editComponent = (index) => {
    this.setState({ currentComponentIndex: index }); // 1 is template index
  };

  showLoader = (show = false) => this.setState({ uploadingData: show });

  render() {
    const {
      componentDetails, currentComponentIndex, uploadingData, showAlert
    } = this.state;
    const currentComponent = componentDetails[currentComponentIndex];
    return (
      <div className="main-wrapper">
        <label onClick={() => console.log('Ongoing Campaign')}>{`New Campaign ~ ${currentComponent.title}`}</label>
        <nav className="form-steps">
          {
            componentDetails.map((c, i) => (
              <div key={i.toString()} className={i < currentComponentIndex ? 'form-steps__item form-steps__item--completed' : 'form-steps__item'}>
                <div className={i === currentComponentIndex ? 'form-steps__item-content form-steps__item--active' : ''}>
                  <span onClick={() => this.setState({ currentComponentIndex: i })} className="form-steps__item-icon">{`Step${i + 1}`}</span>
                  { i !== 0 && <span className="form-steps__item-line" />}
                </div>
              </div>
            ))
          }
        </nav>
        <div className="component-wrapper">
          {React.createElement(currentComponent.component, {
            component: currentComponent,
            handleNext: this.handleNext,
            editComponent: this.editComponent,
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
  goToHome: () => push('/')
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCampaign);
