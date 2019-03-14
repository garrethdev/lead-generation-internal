import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import EmailEditor from 'react-email-editor';
import { saveCampaignContent } from '../../modules/mailChimp';

class Template extends React.Component {

  exportTemplate = () => {

  };

  handleUpload = (htmlContent) => {
    const { saveCampaignContent } = this.props;
    saveCampaignContent(htmlContent);
  };

  handleNext = () => {
    const { component, handleNext } = this.props;
    this.editor.exportHtml((data) => {
      const { html } = data;
      handleNext && handleNext(component.title, html);
    });
  };

  render() {
    const { component } = this.props;
    return (
      <div className="container">
        <br />
        <div>
          <EmailEditor
            ref={(editor) => { this.editor = editor; }}
          />
        </div>
        <br />
        <Button className="btn btn-primary" id="button-send" color="primary" onClick={this.handleNext}>
          {component.butttonTitle}
        </Button>
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
