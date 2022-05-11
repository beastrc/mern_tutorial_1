import React from 'react';

export default class ViewFile extends React.Component {
  constructor(props) {
    super(props);
    this.popupObj = this.props.popupObj;
  }

  onNoBtnClick() {
    if(this.popupObj.noBtnAction) {
      this.popupObj.noBtnAction();
    }
  }

  render() {
    let writingSamples = [];

    if (this.popupObj.writingSamples.length > 0) {
      let that = this;
      writingSamples = this.popupObj.writingSamples.map(function(file, i) {
        return(
          <li key={i}>
            <i className="fa fa-file-pdf-o" aria-hidden="true"></i>{file.name}
            <a href={file.path}><i className="fa fa-download" aria-hidden="true"></i></a>
          </li>
        );
      });
    }

    return (
      <div className="view-profile-modal">
        <div className="modal-header">
          View Writing Samples
        </div>
        <div className="modal-body">
          <ul className="list">
            {writingSamples.length > 0 ? writingSamples : ''}
          </ul>
        </div>
        <div className="modal-footer mt-40 pl-25">
          <button className="btn-negative btn pull-left" data-dismiss="modal" onClick={() => this.onNoBtnClick()}>Cancel</button>
        </div>
      </div>
    )
  }
}
