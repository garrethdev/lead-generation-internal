import React from 'react';
import { Button } from 'reactstrap';
import EmailEditor from 'react-email-editor';

export default class Template extends React.Component {
  componentDidMount() {
    const { campaignDetails: { htmlDesign } } = this.props;
    if (htmlDesign) {
      this.editor.loadDesign(htmlDesign);
    }
  }

  handleNext = () => {
    const { component, handleNext } = this.props;
    this.editor.exportHtml((data) => {
      const { html, design } = data;
      handleNext && handleNext(component.title, { html, htmlDesign: design });
    });
  };

  render() {
    const { component } = this.props;
    return (
      <div className="container">
        <br />
        <div className="editor-element">
          <EmailEditor
            ref={(editor) => { this.editor = editor; }}
          />
        </div>
        <br />
        <Button className="btn btn-primary nxt-btn" id="button-send" color="primary" onClick={this.handleNext}>
          {component.butttonTitle}
        </Button>
      </div>
    );
  }
}
