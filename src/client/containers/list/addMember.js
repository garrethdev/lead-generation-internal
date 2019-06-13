import React from 'react';
import {
  Button, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';

const initialState = {
  email: '',
  firstName: '',
  lastName: '',
  companyName: '',
};

export default class AddMember extends React.Component {
  editor = null;

  state = initialState;

  componentWillReceiveProps(nextProps) {
    const { modalOpen } = this.props;
    if (modalOpen !== nextProps.modalOpen && nextProps.modalOpen === true) {
      this.setState(initialState);
    }
  }

  handleInputChange = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { addMember } = this.props;
    debugger
    addMember(this.state);
  };

  render() {
    const { modalOpen, toggleModal } = this.props;
    const { companyName, email, firstName, lastName } = this.state;
    return (
      <Modal size="medium" isOpen={modalOpen} toggle={toggleModal}>
        <Form onSubmit={this.handleSubmit}>
          <ModalHeader toggle={toggleModal}>Add Member</ModalHeader>
          <ModalBody>
            <div>
              <Label>First Name</Label>
              <Input type="text" name="firstName" id="firstName" placeholder="First Name" value={firstName} onChange={this.handleInputChange} required />
              <Label className="mt-3">Last Name</Label>
              <Input type="text" name="lastName" id="lastName" placeholder="Last Name" value={lastName} onChange={this.handleInputChange} required />
              <Label className="mt-3">Email</Label>
              <Input type="email" name="email" id="email" placeholder="Email" value={email} onChange={this.handleInputChange} required />
              <Label className="mt-3">Company</Label>
              <Input type="text" name="companyName" id="companyName" placeholder="Company" value={companyName} onChange={this.handleInputChange} required />
            </div>
          </ModalBody>
          <ModalFooter className="p-0">
            <Button type="submit" id="submit-button" color="primary" className="w-100 mx-auto">Add</Button>
            {' '}
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}
