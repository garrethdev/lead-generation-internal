import React from 'react';
import renderHTML from 'react-render-html';
import { Button } from 'reactstrap';
import moment from 'moment';

export default class Recap extends React.Component {

  handleNext = () => {
    const { component, handleNext } = this.props;
    handleNext && handleNext(component.title);
  };

  render() {
    const { campaignDetails, component } = this.props;
    const { listDetails, html = '', scheduleDate = moment.now() } = campaignDetails;
    const { name = '' } = listDetails;
    return (
      <div className="container">
        <label>Template</label>
        <br />
        {html ? renderHTML(html) : null}
        <br />
        <label>Date</label>
        <br />
        <label>{JSON.stringify(scheduleDate)}</label>
        <br />
        List
        <label>List</label>
        <br />
        <label>{name}</label>
        <br />
        <Button className="btn btn-primary" color="primary" id="button-add-campaign" onClick={this.handleNext}>
          {component.butttonTitle}
        </Button>
      </div>
    );
  }
}