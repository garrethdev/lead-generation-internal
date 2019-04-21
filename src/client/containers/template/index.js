import React from 'react';
import { Button, Col } from 'reactstrap';
import EmailEditor from 'react-email-editor';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateNewCampaign } from '../../modules/mailChimp';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.editor = null;
  }

  componentDidMount() {
    const { campaignDetails: { template: { htmlDesign } } } = this.props;
    if (htmlDesign) {
      this.editor.loadDesign(htmlDesign);
    }
  }

  handleNext = () => {
    const { handleNext, updateNewCampaign } = this.props;
    this.editor.exportHtml((data) => {
      const { html, design: htmlDesign } = data;
      updateNewCampaign({ template: { html, htmlDesign } });
      this.editor = null;
      handleNext();
    });
  };

  render() {
    return (
      <div className="container">
        <br />
        <div className="editor-element">
          <div id="stripoSettingsContainer">
            <script src="https://plugins.stripo.email/static/latest/stripo.js" />
          </div>
          <div id="stripoPreviewContainer" />
        </div>
        <br />
        <Col md={12}>
          <div className="btn-next">
            <Button className="btn btn-primary nxt-btn" id="button-send" color="primary" onClick={this.handleNext}>
              {'Next'}
            </Button>
          </div>
        </Col>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  campaignDetails: state.mailchimp && state.mailchimp.campaignDetails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateNewCampaign
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Template);
