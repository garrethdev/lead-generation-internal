import React from 'react';
import {
  Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Label, Row, FormGroup, Form
} from 'reactstrap';
import EmailEditor from 'react-email-editor';
import DateTime from 'react-datetime';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import moment from 'moment';

import './campaign.css';

const minuteInterval = 15;

export default class AddCampaign extends React.Component {
  editor = null;

  state = { subjectLine: '', scheduleDate: undefined };

  componentWillMount() {
    const roundedUp = Math.ceil(moment().minute() / minuteInterval) * minuteInterval;
    const defaultDate = moment().minute(roundedUp);
    this.setState({ scheduleDate: defaultDate });
  }

  componentWillReceiveProps(nextProps) {
    const { modalOpen } = this.props;
    if (modalOpen !== nextProps.modalOpen && nextProps.modalOpen === true) {
      this.setState({ subjectLine: '' });
    }
  }

  handleSubjectChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleScheduleDate = (date) => {
    this.setState({ scheduleDate: date });
  };


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

  handleSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { subjectLine, scheduleDate } = this.state;
    const { addCampaign } = this.props;
    this.editor.exportHtml((data) => {
      const { html, design: htmlDesign } = data;
      const campaign = {
        subjectLine,
        scheduleDate,
        html,
        htmlDesign
      };
      addCampaign(campaign);
    });
  };

  render() {
    const { modalOpen, toggleModal } = this.props;
    const { subjectLine, scheduleDate } = this.state;
    return (
      <Modal size="lg" isOpen={modalOpen} toggle={toggleModal}>
        <Form onSubmit={this.handleSubmit}>
          <ModalHeader toggle={toggleModal}>Campaign</ModalHeader>
          <ModalBody>
            <div>
              <Label>Subject</Label>
              <Input type="text" name="subjectLine" id="subjectLine" placeholder="Add the subject for your campaign" value={subjectLine} onChange={this.handleSubjectChange} required />
            </div>
            <div style={{ marginBottom: 40, zIndex: 5 }}>
              <Row>
                <Col>
                  <Label>Date</Label>
                  <DateTime
                    value={scheduleDate}
                    inputProps={{ readOnly: true }}
                    isValidDate={this.getValidDates}
                    timeConstraints={this.getValidTimes(scheduleDate)}
                    onChange={this.handleScheduleDate}
                    dateFormat="MMMM DD, YYYY"
                    timeFormat={false}
                    closeOnSelect
                    closeOnTab
                  />
                </Col>
                <Col>
                  <Label>Time</Label>
                  <DateTime
                    value={scheduleDate}
                    inputProps={{ readOnly: true }}
                    isValidDate={this.getValidDates}
                    timeConstraints={this.getValidTimes(scheduleDate)}
                    onChange={this.handleScheduleDate}
                    dateFormat={false}
                    closeOnSelect
                    closeOnTab
                  />
                </Col>
              </Row>
            </div>
            <div className="editor-element">
              <EmailEditor
                ref={editor => this.editor = editor}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" id="submit-button" color="primary">Add</Button>
            {' '}
            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}
