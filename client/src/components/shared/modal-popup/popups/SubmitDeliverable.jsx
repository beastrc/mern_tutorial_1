import React from 'react';

import { constant, utils } from '../../../../shared/index';
import DragDropFile from '../drag-drop-file/DragDropFile';

let classNames = require('classnames');

export default class SubmitDeliverable extends React.Component {
  constructor(props) {
    super(props);
    this.popupObj = this.props ? this.props.popupObj : {};
    this.role = this.popupObj.role;
    this.state = {
      fileError: "",
      file: {}
    }
    this.downloadFile = this.downloadFile.bind(this);
    this.handler = this.handler.bind(this);
  }

  isSeeker() {
    return (this.role === constant['ROLE']['SEEKER']);
  }

  downloadFile() {
    let obj = { 'filepath': this.popupObj.paymentDetails.paymentDetails['filepath'] };
    let filename = this.popupObj.paymentDetails.paymentDetails['filename'];
    utils.apiCall('DOWNLOAD_DELIVERABLE_FILE', { 'data': obj }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while downloading Deliverable File');
        utils.logger('error', 'Download file Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let res = utils.getDataFromRes(response, 'fileData');
          let binaryString = window.atob(res);
          let binaryLen = binaryString.length;
          let bytes = new Uint8Array(binaryLen);
          for (let i = 0; i < binaryLen; i++) {
            let ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
          }
          let blob = new Blob([bytes],{type: "application/octet-stream"});
          let link = document.createElement("a");
          link.style = "display: none";
          let url =window.URL.createObjectURL(blob);
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          setTimeout(function(){
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  onYesBtnClick(action) {
    if (this.popupObj.yesBtnAction) {
      let isSeeker = this.isSeeker();
      let status = action || (isSeeker ? constant['DELIVERABLE_STATUS']['SUBMITTED'] : constant['DELIVERABLE_STATUS']['APPROVED']);
      if (isSeeker && !this.state.file.name) {
        this.setState({ fileError: this.state.fileError || constant['FILE_UPLOAD_ERROR'] });
        return;
      }

      let paymentData = this.popupObj.paymentDetails;
      let jobObj = {
        jobId: paymentData['jobId'],
        milestone: paymentData.paymentDetails['milestone'],
        milestone_id: paymentData.paymentDetails['_id'],
        status: status,
        filepath: paymentData.paymentDetails['filepath'] || ''
      };

      if (isSeeker) {
        jobObj['fileObj'] = this.state.file;
      }

      this.popupObj.yesBtnAction(jobObj);
    }
  }

  onNoBtnClick() {
    if(this.popupObj.noBtnAction) {
      this.popupObj.noBtnAction();
    }
  }

  handler(err, file) {
    let fileError = '';
    if (err) {
      fileError = err[0]['msg'];
    }
    this.setState({
      fileError: fileError,
      file: file || {}
    });
  }

  render() {
    let jobData = this.popupObj.paymentDetails;
    let noDataSymbol = constant['NO_DATA_SYMBOL'];

    return (
      <div className="submit-deliverable-modal">
        <div className="modal-header text-center p-20 m-0">
          { this.isSeeker() ? 'Submit' : 'Review' } Deliverable for Approval
        </div>
        <div className="modal-body m-0">
          	<h5>Deliverable</h5>
          	<div className="custom-table mb-30 mt-15">
              <div className="custom-thead">
                <div className="custom-tr">
                  <div className="custom-th width-30">Milestone</div>
                  <div className="custom-th width-70">Deliverable</div>
                </div>{/*custom-tr*/}
              </div>{/*custom-thead*/}
              <div className="custom-tbody">
                <div className="custom-tr">
                  <div className="custom-td width-30">
                    <span>{jobData.paymentDetails.milestone}</span>
                  </div>
                  <div className="custom-td width-70">
                    {(jobData.jobType == '1099' && jobData.paymentType == 'Hourly Rate/Fixed Fee') ?
                    <span>On Completion</span>
                    :
                    <span>{jobData.paymentDetails.delivery || noDataSymbol}</span>
                    }
                  </div>
                </div>{/*tr*/}
              </div>{/*custom-tbody*/}
            </div>{/*custom-table*/}
            <div className="modal-responsive">
              <h6 className="p-15">Job</h6>
              <div className="card-view p-0 mb-15">
                <div className="job-details p-15" id="demo11">
                  <h6>Milestone</h6>
                  <p>{jobData.paymentDetails.milestone}</p>
                  <h6>Deliverable</h6>
                  <p>{jobData.paymentDetails.delivery || noDataSymbol}</p>
                </div>{/*job-details*/}
              </div>{/*card-view*/}
            </div>
            <h5>File</h5>
            { this.isSeeker() ?
              <div className={this.state.fileError === '' ? 'upload-file mt-10': 'upload-file mt-10 global-error'}>
                <DragDropFile handler={this.handler} title="Attach File" desc="Attach a file, timesheet, or invoice by clicking and selecting the specific file OR dragging and dropping the specific file into this area.'break'Note: Only one file can be attached, use Zip compression for multiple files." />
                {
                  this.state.fileError === '' ?
                    null
                  :
                    <p className="pull-left mt-0">
                      <span className="m-0">{this.state.fileError}</span>
                    </p>
                }
                <span className="clearfix"></span>
              </div>
            :
              jobData.paymentDetails.filename ?
              <div className="mt-10">
                <h4 className="text-left">
                  <a href="javascript:void(0)" onClick={this.downloadFile.bind(this)}>
                    <b>{jobData.paymentDetails.filename}</b>
                  </a>
                  &nbsp;- Please click this link to download the deliverable.
                </h4>
                <h4 className="text-left">
                  Once you have reviewed it, please return to this dialog to Approve or Reject the deliverable.
                </h4>
                </div>
              :
                <div className="mt-10">
                  <h4 className="text-left">
                    File not available.
                  </h4>
                </div>
            }
        </div>
        <div className="modal-footer">
          <button className="btn-negative btn pull-left" onClick={() => this.onNoBtnClick()}>Cancel</button>
          <button className="btn-primary btn pull-right" onClick={() => this.onYesBtnClick()}>{this.popupObj.yesBtnText}</button>
          { this.isSeeker() ?
              null
            :
              <button className="btn-negative btn pull-right" onClick={() => this.onYesBtnClick(constant['DELIVERABLE_STATUS']['DECLINED'])}>Reject</button>
          }
          <span className="clearfix"></span>
        </div>
      </div>
    )
  }
}
