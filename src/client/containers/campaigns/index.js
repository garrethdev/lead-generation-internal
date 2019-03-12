import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { Button, Input } from 'reactstrap';
import { LIST_ID } from '../../helpers/constants';
import { addMailChimpCampaign, updateCampaignContent } from '../../modules/mailChimp';
import { validateEmail } from '../../helpers/validators';
import SpinnerLoader from '../../components/spinnerLoader';

class Campaigns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectLine: '',
      previewText: '',
      replyTo: '',
      fromName: '',
      uploadingData: false
    };
  }

  handleChange = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleUpload = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const {
      subjectLine, previewText, replyTo, fromName
    } = this.state;
    if (!subjectLine || !replyTo || !fromName) {
      alert('Please enter all details.');
    } else if (validateEmail(replyTo)) {
      alert('Please enter valid email address.');
    } else {
      const {
        addMailChimpCampaign, gotoAddTemplate, updateCampaignContent, htmlContent
      } = this.props;
      const body = {
        recipients: { list_id: LIST_ID },
        type: 'regular',
        settings: {
          subject_line: subjectLine,
          preview_text: previewText,
          reply_to: replyTo,
          from_name: fromName
        }
      };
      this.setState({ uploadingData: true });
      addMailChimpCampaign(body)
        .then(({ id }) => {
          updateCampaignContent(id, { html: htmlContent })
            .then(() => {
              this.setState({ uploadingData: false });
              gotoAddTemplate(id);
            })
            .catch((error) => {
              this.setState({ uploadingData: false });
              console.log('Error uploading template', error);
              alert('Error uploading template, Please try again.');
            });
        })
        .catch((error) => {
          this.setState({ uploadingData: false });
          console.log('Error adding campaign', error);
          alert('Error adding campaign, Please try again.');
        });
    }
  };

  render() {
    const {
      subjectLine, previewText, replyTo, fromName, uploadingData
    } = this.state;
    return (
      <div className="container">
        <br />
        Subject
        <br />
        <Input type="text" name="subjectLine" id="subject-line" placeholder="Add the subject for your campaign" value={subjectLine} onChange={this.handleChange} required />
        <br />
        Preview
        <br />
        <Input type="text" name="previewText" id="preview-text" placeholder="This snippet will appear in the inbox after the subject line" value={previewText} onChange={this.handleChange} />
        <br />
        Reply to
        <br />
        <Input type="email" name="replyTo" id="reply-to" placeholder="Email Address of the sender of the campaign" value={replyTo} onChange={this.handleChange} required />
        <br />
        From
        <br />
        <Input type="email" name="fromName" id="from-name" placeholder="Name of the sender of the campaign" value={fromName} onChange={this.handleChange} required />
        <br />
        <Button className="btn btn-primary" color="primary" id="button-add-campaign" onClick={this.handleUpload}>
          Add Campaign
        </Button>
        <SpinnerLoader isVisible={uploadingData} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  htmlContent: state.mailchimp && state.mailchimp.htmlContent,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  addMailChimpCampaign,
  updateCampaignContent,
  gotoAddTemplate: id => push('/uploadCSV', { id })
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Campaigns);
