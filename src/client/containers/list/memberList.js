import React from 'react';
import {
    Modal, ModalBody, ModalHeader, Table
} from 'reactstrap';

export default class MemberList extends React.Component {

    render() {
        const { modalOpen, toggleModal, members } = this.props;

        return (
            <Modal size="lg" isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Member List</ModalHeader>
                <ModalBody>
                    <div className="table-container">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Email Address</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Company</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{member['Email Address']}</td>
                                        <td>{member['First Name']}</td>
                                        <td>{member['Last Name']}</td>
                                        <td>{member['Company']}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </Table>                
                    </div>
                </ModalBody>                

            </Modal>
        );
    }
}
