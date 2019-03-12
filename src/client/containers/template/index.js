import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import EmailEditor from 'react-email-editor';
import { saveCampaignContent } from '../../modules/mailChimp';

class Template extends React.Component {

  exportTemplate = () => {
    this.editor.exportHtml((data) => {
      const { html } = data;
      this.handleUpload(html);
    });
  };

  handleUpload = (htmlContent) => {
    const { saveCampaignContent } = this.props;
    saveCampaignContent(htmlContent);
  };

  render() {
    return (
      <div className="container">
        <br />
        <div>
          <EmailEditor
            ref={(editor) => { this.editor = editor; }}
          />
        </div>
        <br />
        <Button className="btn btn-primary" id="button-send" color="primary" onClick={this.exportTemplate}>Send</Button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  saveCampaignContent
}, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(Template);
