import React from 'react';
import Select from 'react-select';
import _ from 'lodash';

import { constant, helper, utils } from '../../../../shared/index';
import DragDropFile from '../drag-drop-file/DragDropFile';
import CustomOption from './CustomOption';

export default class SendMsg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: props.popupObj.isInvite
        ? constant['POPUP_MSG']['SEND_INVITE_SUBJECT']
        : '',
      msg: props.popupObj.isInvite
        ? constant['POPUP_MSG']['SEND_INVITE_MSG']
        : '',
      formErrors: { subject: false, msg: false, fileErr: false, job: false },
      formValid: true,
      file: {},
      fileErr: 'no',
      fileErrMsg: '',
      postedJobs: [],
      selectedJob: {}
    };
    this.popupObj = this.props.popupObj;
    this.handleChange = this.handleChange.bind(this);
    this.handleJobChange = this.handleJobChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handler = this.handler.bind(this);
    this.onNoBtnClick = this.onNoBtnClick.bind(this);
    this.onYesBtnClick = this.onYesBtnClick.bind(this);
  }

  componentDidMount() {
    this.props.popupObj.isInvite && this.getPostedJobs();
  }

  getPostedJobs() {
    const that = this;
    utils.apiCall('GET_INVITABLE_JOBS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Posted Jobs');
        utils.logger('error', 'Get Posted Jobs Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          const responseData = utils.getDataFromRes(response);
          const jobOptions = responseData.jobs.map(job => ({
            value: job._id,
            label: job.jobHeadline
          }));
          console.log('jobOptions, ', responseData.jobs);
          that.setState({ postedJobs: jobOptions });
        } else {
          utils.logger('warn', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  onYesBtnClick() {
    const isInvite = !!this.props.popupObj.isInvite;

    this.validateForm(() => {
      if (this.popupObj.yesBtnAction && this.state.formValid) {
        this.popupObj.yesBtnAction(
          this.state.subject,
          this.state.msg,
          isInvite ? this.state.selectedJob.value : this.state.file
        );
      }
    });
  }

  onNoBtnClick() {
    if (this.popupObj.noBtnAction) {
      this.popupObj.noBtnAction();
    }
  }

  handleChange(e) {
    const name = e.target.name;
    this.setState({ [name]: e.target.value }, function() {
      const val = this.state[name];
      if (val.length <= 1) {
        this.validateField(name, val);
      }
    });
  }

  handleJobChange(option) {
    this.setState({
      selectedJob: option,
      formErrors: Object.assign(this.state.formErrors, { job: false })
    });
  }

  handleBlur(e) {
    const name = e.target.name;
    let val = this.state[name];
    !!val && (val = val.trim());
    this.validateField(name, val);
  }

  validateField(fieldName, value) {
    const fieldValidationErrors = this.state.formErrors;
    if (fieldValidationErrors.hasOwnProperty(fieldName)) {
      fieldValidationErrors[fieldName] = false;
      if (!value) {
        fieldValidationErrors[fieldName] = true;
      }

      this.setState({
        formErrors: fieldValidationErrors,
        formValid: !fieldValidationErrors[fieldName]
      });
    }

    this.setState({
      [fieldName]: value
    });
  }

  validateFields(callback) {
    const fieldValidationErrors = this.state.formErrors;
    if (!this.props.popupObj.isInvite) {
      for (const key in this.state.formErrors) {
        let val = this.state[key];
        !!val && (val = val.trim());
        fieldValidationErrors[key] = false;
        if (!val) {
          fieldValidationErrors[key] = true;
        }
        this.setState({
          [key]: val
        });
      }
    } else {
      if (_.isEmpty(this.state.selectedJob)) {
        fieldValidationErrors.job = true;
      }
    }

    this.setState(
      {
        formErrors: fieldValidationErrors
      },
      callback
    );
  }

  validateForm(callback) {
    const { isInvite } = this.props.popupObj;

    this.validateFields(() => {
      let formValid = true;

      if (!isInvite) {
        for (const key in this.state.formErrors) {
          if (this.state.formErrors[key] && key !== 'job') {
            formValid = false;
            break;
          }
        }
      } else {
        formValid = !_.isEmpty(this.state.selectedJob);
      }

      this.setState({ formValid: formValid }, callback);
    });
  }

  handler(err, file) {
    let formErrObj = this.state.formErrors,
      fileErr = 'no',
      fileErrMsg = '';
    formErrObj['fileErr'] = false;

    if (err) {
      formErrObj['fileErr'] = true;
      fileErr = '';
      fileErrMsg = err[0]['msg'];
    }
    this.setState({
      formErrors: formErrObj,
      fileErrMsg: fileErrMsg,
      fileErr: fileErr,
      file: file || {}
    });
  }

  render() {
    const { isInvite, role } = this.popupObj;
    const {
      formErrors,
      fileErrMsg,
      msg,
      subject,
      postedJobs,
      selectedJob
    } = this.state;
    const processedMsg = isInvite ? msg.replace(' - <JOB_LINK>', '.') : msg;

    return (
      <div className="send-msg-modal">
        <div className="modal-header text-center p-20 m-0">
          Send
          {isInvite ? ' Invitation ' : ' Message '}
          to
          {role === constant['ROLE']['SEEKER']
            ? ' Hiring Manager'
            : ' Candidate'}
        </div>
        <div className="modal-body m-0">
          <form>
            <div
              className={
                formErrors.subject === true
                  ? 'form-group m-0 global-error'
                  : 'form-group m-0'
              }
            >
              <input
                type="text"
                name="subject"
                className="form-control"
                placeholder="Your Subject..."
                value={subject}
                readOnly={isInvite}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
              />
              {formErrors.subject === true ? (
                <p>
                  <span>
                    {helper.getValidationMsg('REQUIRED_FIELD', {
                      fieldName:
                        constant['VALIDATION_MSG']['FIELDS_NAME']['SUBJECT']
                    })}
                  </span>
                </p>
              ) : null}
            </div>
            <div
              className={
                formErrors.msg === true
                  ? 'form-group m-0 global-error'
                  : 'form-group m-0'
              }
            >
              <textarea
                name="msg"
                className="full-width mt-20"
                rows="7"
                placeholder="Your Message..."
                value={processedMsg}
                readOnly={isInvite}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
              ></textarea>
              {formErrors.msg === true ? (
                <p>
                  <span>
                    {helper.getValidationMsg('REQUIRED_FIELD', {
                      fieldName:
                        constant['VALIDATION_MSG']['FIELDS_NAME']['MSG']
                    })}
                  </span>
                </p>
              ) : null}
            </div>
            {isInvite ? (
              <div className="col-12 mt-40 form-group">
                <Select
                  className="posted-job"
                  clearable={false}
                  closeOnSelect={true}
                  onBlurResetsInput={true}
                  autosize={false}
                  placeholder="Select Job Headline"
                  options={postedJobs}
                  value={selectedJob.value}
                  onChange={this.handleJobChange}
                  optionComponent={CustomOption}
                />
                {formErrors.job && (
                  <div className="global-error">
                    <p>
                      <span>Please select the job</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={
                  formErrors.fileErr === true
                    ? 'form-group m-0 global-error'
                    : 'form-group m-0'
                }
              >
                <DragDropFile
                  handler={this.handler}
                  title="Attach File (Optional)"
                  desc="Attach a file by clicking and selecting a file OR dragging & dropping a file to this area (use ZIP compression for multiple files)"
                />
                {formErrors.fileErr === true ? (
                  <p className="pull-left mt-10">
                    <span className="m-0">{fileErrMsg}</span>
                  </p>
                ) : null}
              </div>
            )}
            <span className="clearfix"></span>
          </form>
        </div>
        <div className="modal-footer">
          <button
            className="btn-negative btn pull-left"
            onClick={this.onNoBtnClick}
          >
            Cancel
          </button>
          <button
            className="btn-primary btn pull-right"
            onClick={this.onYesBtnClick}
          >
            Send Message
          </button>
        </div>
      </div>
    );
  }
}
