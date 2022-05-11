import React from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import { Link } from 'react-router';
// import { Truncate } from 'react-read-more';
import ReadMoreReact from 'read-more-react';

import { config, constant, helper, utils } from '../../../../shared/index';
import ModalPopup from '../../../shared/modal-popup/ModalPopup';
let classNames = require('classnames');

export default class NegotiatingTerms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepRelatedData: props.stepRelatedData,
      highestStep: props.highestStep,
      employment_type_dropdown: [],
      formError: {},
      disableHours: false,
      legablyServiceCharges: 0,
      remainingAmount: '',
      modalPopupObj: {},
      freezeActivity: props.stepRelatedData.freeze_activity || false,
      jobType: props.jobType || '',
      paymentType: props.paymentType || ''
    }
    this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
    this.validateData = this.validateData.bind(this);
    this.validatePaymentData = this.validatePaymentData.bind(this);
    this.submitTerms = this.submitTerms.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.validateForm =  this.validateForm.bind(this);
    this.validateLength = this.validateLength.bind(this);
    this.calculateTotalAmount = this.calculateTotalAmount.bind(this);
    this.removePaymentDetail = this.removePaymentDetail.bind(this);
    this.calculateRemainingAmount = this.calculateRemainingAmount.bind(this);
    this.addPaymentDetail = this.addPaymentDetail.bind(this);
    this.onSendMsgBtnClick = this.onSendMsgBtnClick.bind(this);
    this.onWithdrawBtnClick = this.onWithdrawBtnClick.bind(this);
    this.onAcceptTermsBtnClick = this.onAcceptTermsBtnClick.bind(this);
  }

  getAllDropdownsData() {
    let that = this;
    let employmentTypes = [];

    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get Job Detail Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);
          for (let eTypesObj of data['employment_types']) {
            if (eTypesObj['name'] === 'Part-time'){
              employmentTypes[0] = ({value: eTypesObj['_id'], label: eTypesObj['name']});
            } else if(eTypesObj['name'] === 'Full-time') {
              employmentTypes[1] = ({value: eTypesObj['_id'], label: eTypesObj['name']});
            }
          }
          that.setState({
            employment_type_dropdown: employmentTypes
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    })
  }

  calculateTotalAmount () {
    let jobObj = this.state.stepRelatedData, subtotal, total;
    let formError = this.state.formError;
    if (jobObj['rateType'] === utils.ENUM.RATE_TYPE.FIXED) {
      jobObj['hours'] = 0;
      if (formError.hours) {
        delete formError.hours;
      }
      subtotal = jobObj['rate'] || 0;
    } else {
      if (jobObj['rate'] > 0 && jobObj['hours'] > 0) {
        subtotal = (jobObj['rate'] || 0) * (jobObj['hours'] || 0);
      }
    }
    jobObj.paymentDetails = [];
    jobObj.paymentDetails.push({rate: '', delivery: '',dueDate: ''})
    subtotal = subtotal ? subtotal : 0;
    jobObj['subTotal'] = Number(parseFloat(subtotal).toFixed(2));
    (jobObj['subTotal'] < 100) ? formError['subTotal'] = constant['MIN_JOB_AMOUNT'] : delete formError['subTotal'];
    this.state.legablyServiceCharges = parseFloat(parseFloat(jobObj['subTotal'] * jobObj['currentRate'] / 100).toFixed(2));
    jobObj['total'] = jobObj['subTotal'] + this.state.legablyServiceCharges;

    this.setState({ stepRelatedData: jobObj, legablyServiceCharges: this.state.legablyServiceCharges, formError: formError});
  }

  validateLength (ev, key, maxValue) {
    let val = ev.target.value + '';
    let maxLen = String(maxValue).length;
    val = val.replace(/[^0-9.]/g, "");
    val = val.substr(0, (maxValue+'').length);
    let jobObj = this.state.stepRelatedData;
    jobObj[key] = val;
    this.setState({ stepRelatedData: jobObj});
  }

  validateData (ev, key, limit) {
    let val = ev.target.value, disabled = this.state.disableHours, subTotal;
    let jobObj = this.state.stepRelatedData;
    switch(key) {
      case 'rate':
        this.validateLength(ev, key, limit);
        this.calculateTotalAmount();
        this.calculateRemainingAmount('');
        break;
      case 'hours':
        this.validateLength(ev, key, limit);
        this.calculateTotalAmount();
        this.calculateRemainingAmount('');
        break;
      case 'rateType': jobObj[key] = val;
        disabled = jobObj[key] == utils.ENUM.RATE_TYPE.FIXED ? true : false;
        jobObj.hours = (jobObj[key] != utils.ENUM.RATE_TYPE.FIXED && jobObj.hours == 0) ? '' : jobObj.hours;
        this.calculateTotalAmount();
        this.calculateRemainingAmount('');
        break;
      case 'hoursType': jobObj[key] = val;
        this.setState({ stepRelatedData: jobObj });
        break;
    }
    this.setState({ disableHours: disabled });
  }

  calculateRemainingAmount (key) {
    let jobObj = this.state.stepRelatedData, totalRate = 0,
      total = jobObj.subTotal, remainingAmount = this.state.remainingAmount;
    let formError = this.state.formError;
    jobObj.paymentDetails.forEach((payment) => {
      payment.dueDate = payment.dueDate || '';
      !isNaN(payment.rate) && (totalRate += Number(payment.rate || 0));
    });
    remainingAmount = parseFloat(total - totalRate).toFixed(2);
    if (remainingAmount > 0 && key != 'init') {
      jobObj.paymentDetails.forEach((payment) => {
        delete payment.errorMessage;
      });
      if (formError.paymentDetails) {
        delete formError.paymentDetails;
      }
    }
    remainingAmount = (remainingAmount > 0) ? remainingAmount : 0;
    this.setState({ remainingAmount:  parseFloat(remainingAmount).toFixed(2), stepRelatedData: jobObj, formError: formError });
  }

  validatePaymentData (ev, key, index, limit) {
    let jobObj = this.state.stepRelatedData, totalRate = 0,
    total = jobObj.subTotal, remainingAmount = this.state.remainingAmount;
    let formError = this.state.formError;
    switch(key) {
      case 'rate':
        let msg = '';
        let val = ev.target.value + '';
        let maxLen = String(limit).length;
        val = val.replace(/[^0-9.]/g, "");
        val = val.substr(0, (limit+'').length);
        jobObj.paymentDetails[index][key] = val;
        if (formError.paymentDetails) {
          delete formError.paymentDetails;
        }
        if (formError.rate || (jobObj.rateType === utils.ENUM.RATE_TYPE.HOURLY && jobObj.hours == '')) {
          msg = (jobObj.rateType === utils.ENUM.RATE_TYPE.HOURLY) ? constant['PAYMENT_RATE'] : constant['ENTER_RATE'];
          formError.paymentDetails = msg;
          jobObj.paymentDetails[index][key] = '';
        } else {
          jobObj.paymentDetails.forEach((payment) => {
            !isNaN(payment.rate) && (totalRate += Number(payment.rate || 0));
          });
          remainingAmount = parseFloat(total - totalRate).toFixed(2);
          if (remainingAmount < 0 ) {
            remainingAmount = 0;
            msg = constant['PAYMENT_RATE_ERROR'];
            formError.paymentDetails = msg;
          } else {
            msg = '';
          }
        }
        jobObj.paymentDetails.forEach((payment) => {
          if (!msg) {
            delete payment.errorMessage;
          } else{
            payment.errorMessage = msg;
          }
        });
        break;
      case 'delivery':
        jobObj.paymentDetails[index][key] = ev.target.value;
        break;
      case 'dueDate':
        let date = moment.isMoment(ev) ? ev.format(constant['DATE_FORMAT']) : ev;
        let errMsg = '';
        if (formError.paymentDetails) {
          delete formError.paymentDetails;
        }
        if (!date) {
          errMsg = constant['ENTER_DUE_DATE'];
        }
        jobObj.paymentDetails[index][key] = date;
        jobObj.paymentDetails.forEach((payment) => {
          errMsg ? (payment.errorMessageDueDate = errMsg) : delete payment.errorMessageDueDate;
        });
        break;
    }
    this.setState({ stepRelatedData: jobObj, remainingAmount: parseFloat(remainingAmount).toFixed(2), formError: formError });
  }

  handleOnBlur (ev, key) {
    let formError = this.state.formError, jobObj = this.state.stepRelatedData;
    let val = ev.target.value;
    if (formError[key]) {
      delete formError[key];
    }
    switch(key) {
      case 'rate':
        if (!val) {
          formError[key] = constant['ENTER_RATE'];
        } else if (!(Number(val))) {
          formError[key] = constant['RATE_ERROR'];
        }
        break;
      case 'hours':
        if (!val) {
          formError[key] = constant['ENTER_HOURS'];
        } else if (!(Number(val))) {
          formError[key] = constant['HOURS_ERROR'];
        }
        break;
    }
    if (!formError['rate'] && !formError['hours'] && formError['paymentDetails']) {
      delete formError['paymentDetails'];
      jobObj.paymentDetails.forEach((payment) => {
        delete payment.errorMessage;
      });
    }
    this.setState({ formError: formError, stepRelatedData: jobObj });
  }

  addPaymentDetail (callFromDidMount) {
    let stepRelatedData = this.state.stepRelatedData;
    let paymentDetail = stepRelatedData.paymentDetails;
    paymentDetail.push({rate: '', delivery: '', dueDate:''});

    stepRelatedData.paymentDetails = paymentDetail;
    this.setState({ stepRelatedData: stepRelatedData });
    !callFromDidMount && this.calculateRemainingAmount('');
  }

  removePaymentDetail (index) {
    let stepRelatedData = this.state.stepRelatedData;
    let paymentDetail = stepRelatedData.paymentDetails;
    paymentDetail.splice(index, 1);

    stepRelatedData.paymentDetails = paymentDetail;
    this.setState({ stepRelatedData: stepRelatedData });
    this.calculateRemainingAmount('');
  }

  validateForm() {
    let validForm = true;
    let stepRelatedData = this.state.stepRelatedData;
    let formError = this.state.formError;
    if (!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee')) {
      if (stepRelatedData.hours == '' && stepRelatedData.rateType === utils.ENUM.RATE_TYPE.HOURLY) {
        formError.hours = constant['ENTER_HOURS'];
      }
      (stepRelatedData['subTotal'] < 100) ? (formError['subTotal'] = constant['MIN_JOB_AMOUNT']) : delete formError['subTotal'];
      stepRelatedData.paymentDetails.forEach((payment) => {
        if (payment.rate === '') {
          payment.errorMessage = constant['ENTER_RATE'];
          if (!formError.paymentDetails) {
            formError.paymentDetails = constant['ENTER_RATE'];
          }
        }
  
        if (payment.dueDate === '') {
          payment.errorMessageDueDate = constant['ENTER_DUE_DATE'];
          if (!formError.paymentDetails) {
            formError.paymentDetails = constant['ENTER_DUE_DATE'];
          }
        }
      });
    } else {
      if (stepRelatedData.rateType == utils.ENUM.RATE_TYPE.HOURLY) {
        if (formError.subTotal) {
          delete formError.subTotal;
        }
      } else {
        if (formError.hours) {
          delete formError.hours;
        }
      }
    }
    this.setState({ stepRelatedData: stepRelatedData, formError: formError });
    if (formError && Object.keys(formError).length != 0) {
      validForm = false;
    }
    if (this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee' && stepRelatedData.rateType == utils.ENUM.RATE_TYPE.FIXED) {
      if (formError.subTotal) {
        helper.openNegativeInfoMessagePopup(this, formError.subTotal);
      }
    }
    return validForm;
  }

  // Valid due date - In Sequential Order and cannot be less than current date
  isValidDueDate() {
    let timestempArr = [];
    let paymentDetailsArr = this.state.stepRelatedData.paymentDetails;
    let sameOrAfterCurrentDate = true;
    for(let obj of paymentDetailsArr) {
      timestempArr.push(new Date(obj['dueDate']).getTime());
      if (moment(obj['dueDate']).isBefore(utils.getCurrentEstDate())) {
        sameOrAfterCurrentDate = false;
        break;
      }
    }

    return (sameOrAfterCurrentDate && timestempArr.every((val, i, arr) => !i || (val >= arr[i - 1])));
  }

  submitTerms() {
    let _this = this;
    if (_this.validateForm()) {
      if (Number(_this.state.remainingAmount) !== 0.00 && !(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee')) {
        helper.openNegativeInfoMessagePopup(_this, 'REMAINING_AMOUNT_ERROR');
      } else if (!_this.isValidDueDate() && !(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee')) {
        helper.openNegativeInfoMessagePopup(_this, 'SEQUENTIAL_ORDER_DUE_DATE', null, true);
      } else {
        let req = _this.state.stepRelatedData;
        req.jobType = this.state.jobType;
        req.paymentType = this.state.paymentType;
        utils.apiCall('UPDATE_N_TERMS', { 'data': req }, function(err, response) {
          if (err) {
            utils.flashMsg('show', 'Error while updating Negotiating Terms');
            utils.logger('error', 'Update Negotiating Terms Error -->', err);
          } else {
            if (utils.isResSuccess(response)) {
              let msg = constant['POPUP_MSG']['SUBMIT_TERMS_SUCCESS'] + constant['POPUP_MSG']['SUBMIT_TERMS_FRAGMENT'];
              helper.openSuccessMessagePopup(_this, msg, null, true);
            } else if (utils.isResConflict(response)) {
              helper.openConflictPopup(_this);
            } else if (utils.isResBarIdValid(response)) {
              helper.openBarIdInvalidPopup(_this);
            } else if (utils.isResLocked(response)) {
              helper.openFreezeActivityPopup(_this, 'ACCOUNT_FROZEN_POSTER');
            } else {
              utils.flashMsg('show', utils.getServerErrorMsg(response));
            }
          }
        });
      }
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      stepRelatedData: props.stepRelatedData,
      highestStep: props.highestStep,
      freezeActivity: props.stepRelatedData.freeze_activity || false,
      jobType: props.jobType,
      paymentType: props.paymentType
    });
  }

  componentDidMount() {
    let stepRelatedData = this.state.stepRelatedData
    if (!stepRelatedData['declined_by']) {
      $('.card').on('keydown', '.custom-num', function(evt) {
        var evtKey = evt.key && (evt.key).toLowerCase();
        if ( evtKey == '.' || evtKey == 'decimal') {
          return ($(this).val().indexOf('.') == -1);
        }
      });

      if (stepRelatedData.paymentDetails && stepRelatedData.paymentDetails.length === 0) {
        this.addPaymentDetail(true);
      }

      this.calculateRemainingAmount('init');
      this.getAllDropdownsData();
      this.setState({
        legablyServiceCharges: (stepRelatedData['subTotal'] * stepRelatedData['currentRate'] / 100),
        disableHours: (stepRelatedData['rateType'] === utils.ENUM.RATE_TYPE.FIXED) ? 'disabled': false
      });
    }
  }

  onSendMsgBtnClick(userId) {
    helper.openSendMessagePopup(this, userId);
  }

  onWithdrawBtnClick(jobId, action, userId, withdrawBy) {
    helper.openDeclineCandidatePopup(this, () => {
      this.updateCandidateJobStatus(jobId, action, userId, withdrawBy);
    }, withdrawBy);
  }

  onAcceptTermsBtnClick (jobId, action, userId) {
    let self = this;
    let popupType = constant['POPUP_TYPES']['CONFIRM'];
    self.setState({
      modalPopupObj: {
        type: popupType,
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/info-alert-icon.svg',
        msg: constant['POPUP_MSG']['CONFIRM_MSG'] + constant['POPUP_MSG']['ACCEPT_TERMS'],
        noBtnText: 'Cancel',
        yesBtnText: 'Accept',
        noBtnAction: function() { utils.modalPopup(popupType, 'hide', self) },
        yesBtnAction: function() {
          self.acceptTerms(popupType, jobId, action, userId);
        }
      }
    }, function() {
      utils.modalPopup(popupType, 'show', self);
    });
  }

  acceptTerms(popupType, jobId, action, userId) {
    this.updateCandidateJobStatus(jobId, action, userId, null, popupType, () => {
      setTimeout(() => {
        let msg = constant['POPUP_MSG']['ACCEPT_TERMS_SUCCESS'] + constant['POPUP_MSG']['ACCEPT_TERMS_FRAGMENT'];
        helper.openSuccessMessagePopup(this, msg, null, true);
      }, 600);
    });
  }

  updateCandidateJobStatus(jobId, action, userId, withdrawBy, popupType, callback) {
    let that = this;
    let req = {
      job_id: jobId,
      status: action,
      freeze_activity: that.state.freezeActivity
    };
    (withdrawBy === constant['ROLE']['POSTER']) && (req['user_id'] = userId);
    utils.apiCall('UPDATE_JOB_STATUS', { 'data': req }, function(err, response) {
      utils.modalPopup(popupType, 'hide', that);
      if (err) {
        utils.flashMsg('show', 'Error while performing this action');
        utils.logger('error', 'Update Job Status Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          if (withdrawBy === constant['ROLE']['SEEKER']) {
            let stepData = {
              'declined_by': constant['ROLE']['SEEKER']
            };
            that.setState({
              'highestStep': req['status'],
              'stepRelatedData': stepData
            });
          } else if (req['status'] === constant['JOB_STEPS']['S_PENDING']) {
            that.setState({
              'highestStep': req['status'],
            });
          }

          utils.isFunction(callback) && callback();
          if (that.state.jobType == '1099' && that.state.paymentType == 'Hourly Rate/Fixed Fee' && !withdrawBy && req['status'] === constant['JOB_STEPS']['S_PENDING']) {
            that.getPendingStepData(constant['ROLE']['POSTER'], that.state.stepRelatedData.seekerId, req['status']);
          }
          else if (that.state.jobType == '1099' && that.state.paymentType == 'Hourly Rate/Fixed Fee' && !withdrawBy && req['status'] === constant['JOB_STEPS']['IN_PROGRESS']) {
            that.props.handler(constant['JOB_STEPS']['IN_PROGRESS'], constant['JOB_STEPS']['IN_PROGRESS']);
          } else {
            let hStep = utils.getDataFromRes(response, 'current_highest_job_step');
            that.props.handler(req['status'], hStep);
          }
        } else if (utils.isResConflict(response)) {
          helper.openConflictPopup(that);
        } else if (utils.isResBarIdValid(response)) {
          helper.openBarIdInvalidPopup(that);
        } else if (utils.isResLocked(response)) {
          let key = (withdrawBy === constant['ROLE']['POSTER']) ? 'ACCOUNT_FROZEN_POSTER' : 'ACCOUNT_FROZEN_SEEKER';
          helper.openFreezeActivityPopup(that, key);
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  checkPayAvailability(pendingStepDataObj) {
    let that = this;
    utils.apiCall('GET_JOB_DETAIL', { 'params': [that.props.jobId, constant['ROLE']['SEEKER']] }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Job Detail');
        utils.logger('error', 'Get Job Detail Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let responseData = utils.getDataFromRes(response, 'job_detail');
          let seekerStepData = responseData.step_data[0];
          if (seekerStepData && pendingStepDataObj.stripe_account_status == constant['STRIPE_ACCOUNT_STATUS']['ACTIVATED'] && 
              seekerStepData.stripe_account_status == constant['STRIPE_ACCOUNT_STATUS']['ACTIVATED'] &&
              seekerStepData.is_w_nine_info_complete)
          {
            that.updateCandidateJobStatus(that.props.jobId, constant['JOB_STEPS']['IN_PROGRESS'], that.state.stepRelatedData.seekerId, null);
          } else {
            that.props.handler(constant['JOB_STEPS']['S_PENDING'],constant['JOB_STEPS']['S_PENDING']);
          }
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  getPendingStepData(userRole, userId, status) {
    let that = this;
    let req = {
      job_id: that.props.jobId,
      step: status,
      highestStep: status,
      user_role: userRole,
      userId: userId
    }
    utils.apiCall('GET_STEP_DATA', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Step Data');
        utils.logger('error', 'Get Step Data Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let stepData =  utils.getDataFromRes(response, 'step_data');
          let pendingStepDataObj = (stepData && stepData.length) ? stepData[0] : null;
          if (pendingStepDataObj) {
            that.checkPayAvailability(pendingStepDataObj);
          } else {
            utils.flashMsg('show', utils.getServerErrorMsg(response));
          }
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  validDueDate(current) {
    return (moment(current.format(constant['DATE_FORMAT'])).isSameOrAfter(utils.getCurrentEstDate()));
  }

  renderDay(props, currentDate, selectedDate) {
    return (<td {...utils.getUpdatedCalenderProps(props, currentDate)}>{ currentDate.date() }</td>);
  }

  render() {
    let stepRelatedData = this.state.stepRelatedData,
    jobId = this.props.jobId;

    let isTermAccepted = this.state.highestStep > constant['JOB_STEPS']['N_TERMS'];
    let seekerName = stepRelatedData.seekerFirstName + ' ' + stepRelatedData.seekerLastName;
    let seizedBtn = this.state.freezeActivity || false;

    let primaryBtn = classNames({
      'btn-primary btn': true,
      'seized-btn': seizedBtn
    });
    let withdrawBtn = classNames({
      'btn-grey btn mr-15': true,
      'seized-btn': seizedBtn
    });

    return (
      <div>
        { this.props.role === constant['ROLE']['SEEKER'] ?
          this.state.highestStep < 0 ?
            (
              <div className="status-content mt-45">
                {
                  (stepRelatedData.declined_by === constant['ROLE']['SEEKER']) ?
                    constant['MESSAGES']['DECLINED_BY_CANDIDATE']
                  :
                    constant['MESSAGES']['DECLINED_BY_HIRING_MANAGER']
                }
              </div>
            )
          :
            (
              <div>
                {
                  isTermAccepted ?
                    <div className="status-content mt-45">
                      <h6>Congratulations!</h6>
                      <p>Here are the job terms that you and the hiring manager have agreed upon.</p>
                    </div>
                  :
                    <div className="status-content mt-45">
                      <h6>Here are the terms proposed by the hiring manager.</h6>
                      <p>To accept the terms and get started please click the Accept Terms button. To request changes to the terms please click the Send Message Proposing New Terms button and send a message to the hiring manager telling them how you'd like the terms modified.</p>
                    </div>
                }

                <div className="proposed-terms status-content mt-30">
                  <form>
                    <h6>
                      {
                        isTermAccepted ? 'Accepted Terms' : 'Proposed Terms'
                      }
                    </h6>
                    <div className="card">
                      <div className="posting-two-cols">
                        <div className="form-group">
                          <label className="control-label">TARGET RATE*</label>
                          <div className="inline-to-block">
                            <input type="text" className="form-control amount-dollar-bg text-left custom-num" placeholder="Rate"
                            defaultValue={stepRelatedData.rate} readOnly />
                          </div>
                          <ul className="tabbed-radio-btns">
                            <li>
                              <input type="radio" name="h-f" defaultChecked={stepRelatedData.rateType == utils.ENUM.RATE_TYPE.HOURLY ? 1 : 0} defaultValue={utils.ENUM.RATE_TYPE.HOURLY} disabled="true" />
                              <span>Hourly</span>
                            </li>
                            <li>
                              <input type="radio" name="h-f" defaultChecked={stepRelatedData.rateType == utils.ENUM.RATE_TYPE.FIXED ? 1 : 0} defaultValue={utils.ENUM.RATE_TYPE.FIXED} disabled="true" />
                              <span>Fixed</span>
                            </li>
                          </ul>
                        </div>{/*form-group*/}
                      </div>{/*posting-two-cols*/}
                      {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') &&
                        <div className="posting-two-cols hours-col">
                          <div className="form-group">
                            <label className="control-label">ESTIMATED HOURS OF WORK REQUIRED*</label>
                            <div className="inline-to-block">
                              <input type="text" className="form-control custom-num" placeholder="00" defaultValue={stepRelatedData.hours} readOnly />
                            </div>
                            <div className="pt-ft-w-m">
                              <ul className="tabbed-radio-btns">
                                {this.state.employment_type_dropdown.map((hoursType, index) =>
                                  <li key={index}>
                                    <input type="radio" name="pt-ft" defaultChecked={hoursType.value == stepRelatedData.hoursType ? 1 : 0} defaultValue={hoursType.value} disabled="true" />
                                    <span>{hoursType.label}</span>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      }
                      {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') &&
                        <div className="estimated-section">
                          <div className="row">
                            <div className="col-sm-4">
                              <div className="form-group">
                                <label className="control-label">ESTIMATED AMOUNT PAYABLE TO CANDIDATE</label>
                                <input type="text" className="form-control amount-dollar-bg" placeholder="Total" defaultValue={stepRelatedData.subTotal} readOnly />
                              </div>
                            </div>
                          </div>
                          <h6>Estimated Payment and Deliverable Schedule</h6>
                          <ul className="hidden-xs row mb-0">
                            <li className="col-sm-4">
                              <label className="control-label">Amount Payable</label>
                            </li>
                            <li className="col-sm-4">
                              <label className="control-label">On Delivery Of</label>
                            </li>
                            <li className="col-sm-4">
                              <label className="control-label">Due Date</label>
                            </li>
                          </ul>
                          {stepRelatedData.paymentDetails.map((payment, index) =>
                            <ul className="payment-details row" key={index}>
                              <li className="col-sm-4">
                                <span className="hidden visible-xs">Amount Payable*</span>
                                <input type="text" className="form-control amount-dollar-bg custom-num" placeholder="Payment"
                                defaultValue={payment.rate} readOnly />
                                <p className="static"><span></span></p>
                              </li>

                              <li className="col-sm-4">
                                <span className="hidden visible-xs">On Delivery Of</span>
                                <input type="text" className="form-control" placeholder="Deliverable Description" defaultValue={payment.delivery || ''} readOnly />
                              </li>

                              <li className="col-sm-4">
                                <span className="hidden visible-xs">Due Date</span>
                                <div className="rdt">
                                  <input type="text" className="form-control" value={payment.dueDate || ''} placeholder="Due Date" name="searchStartDate" readOnly />
                                  <div className="rdtPicker">
                                    <div className="rdtDays">
                                    </div>
                                  </div>
                                </div>
                              </li>
                            <p></p>
                            <p></p>
                            </ul>
                          )}
                        </div>
                      }
                      <span className="clearfix"></span>
                    </div>
                    <div className="text-right d-block p-0">
                      {
                        this.state.highestStep === constant['JOB_STEPS']['J_COMPLETE'] ?
                          null
                        :
                          <button type="button" className="btn-primary btn" onClick={this.onSendMsgBtnClick.bind(this, null)}>Send Message Proposing New Terms</button>
                      }
                      {
                        isTermAccepted ?
                          null
                        :
                          <button type="button" className={primaryBtn} onClick={this.onAcceptTermsBtnClick.bind(this, jobId, constant['JOB_STEPS']['S_PENDING'], stepRelatedData.seekerId)}>Accept Terms</button>
                      }
                    </div>
                    <span className="clearfix"></span>
                  </form>
                </div>{/*proposed-terms*/}
                {
                  isTermAccepted ?
                    null
                  :
                    <div className="status-content proposed-terms-footer">
                      <div className="separator"></div>
                      <div className="btn p-0 m-0">
                        <button type="button" className={withdrawBtn} onClick={this.onWithdrawBtnClick.bind(this, jobId, (constant['JOB_STEPS']['N_TERMS'] * -1), stepRelatedData.seekerId, constant['ROLE']['SEEKER'])}>Withdraw From Consideration</button>
                      </div>
                      <p className="d-inline-block m-0 pb-10">To remove yourself from consideration for this job click the Withdraw From Consideration button.</p>
                    </div>
                }
              </div>
            )
        :
          <div>
            {
              isTermAccepted ?
                <div className="status-content mt-45">
                  <h6>Congratulations!</h6>
                  <p>Here are the job terms that you and {seekerName} have agreed upon.</p>
                </div>
              :
                <div className="status-content mt-45">
                  <h6>You have decided to hire {seekerName} for the job displayed below.</h6>
                  <p>To move forward, please propose your terms below and click the Submit Terms button to send them to {seekerName} for review and acceptance. If you want to send a message to {seekerName} during the negotiating process click the Send Message button.</p>
                  <p className="mt-10">Once your candidate has accepted your proposed terms, we’ll let you know!</p>
                </div>
            }

            <div className="proposed-terms status-content mt-30">
              <form>
                <h6>
                  {
                    isTermAccepted ? 'Accepted Terms' : 'Proposed Terms'
                  }
                </h6>
                <div className="card m-0">
                  <div className="posting-two-cols">
                    <div className="form-group">
                      <label className="control-label">TARGET RATE*</label>
                      <div className={this.state.formError.rate ? 'global-error inline-to-block' : 'inline-to-block' }>
                        <input type="text" className="form-control amount-dollar-bg text-left custom-num" placeholder="Rate"
                        value={stepRelatedData.rate} onChange={(e) => this.validateData(e, 'rate', 999999)} onBlur={(e) => this.handleOnBlur(e, 'rate')} readOnly={isTermAccepted} />
                        {this.state.formError.rate ? <p><span> {this.state.formError.rate} </span></p> : ''}
                      </div>
                      <ul className="tabbed-radio-btns">
                        <li>
                          <input type="radio" name="h-f" checked={stepRelatedData.rateType == utils.ENUM.RATE_TYPE.HOURLY ? 1 : 0} value={utils.ENUM.RATE_TYPE.HOURLY} onChange={(e) => this.validateData(e, 'rateType', '')} disabled={isTermAccepted} />
                          <span>Hourly</span>
                        </li>
                        <li>
                          <input type="radio" name="h-f" checked={stepRelatedData.rateType == utils.ENUM.RATE_TYPE.FIXED ? 1 : 0} value={utils.ENUM.RATE_TYPE.FIXED} onChange={(e) => this.validateData(e, 'rateType', '')} disabled={isTermAccepted} />
                          <span>Fixed</span>
                        </li>
                      </ul>
                    </div>{/*form-group*/}
                  </div>{/*posting-two-cols*/}
                  {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') &&
                  <div className="posting-two-cols hours-col">
                    <div className="form-group">
                      <label className="control-label">ESTIMATED HOURS OF WORK REQUIRED*</label>
                      <div className={this.state.formError.hours && stepRelatedData.rateType != utils.ENUM.RATE_TYPE.FIXED ? 'global-error inline-to-block' : 'inline-to-block' }>
                        <input type="text" className="form-control custom-num" placeholder="00" value={stepRelatedData.hours}
                        onChange={(e) => this.validateData(e, 'hours', 999)} onBlur={(e) => this.handleOnBlur(e, 'hours')}
                        disabled={this.state.disableHours} readOnly={isTermAccepted} />
                        {this.state.formError.hours ? <p><span> {this.state.formError.hours} </span></p> : ''}
                      </div>
                      <div className="pt-ft-w-m">
                        <ul className="tabbed-radio-btns">
                          {this.state.employment_type_dropdown.map((hoursType, index) =>
                            <li key={index}>
                              <input type="radio" name="pt-ft" checked={hoursType.value == stepRelatedData.hoursType ? 1 : 0} value={hoursType.value} onChange={(e) => this.validateData(e, 'hoursType', '')} disabled={this.state.disableHours || isTermAccepted} />
                              <span>{hoursType.label}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  }
                  {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') &&
                  <div className="estimated-section">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className={this.state.formError.subTotal ? 'global-error form-group' : 'form-group' }>
                          <label className="control-label">ESTIMATED AMOUNT PAYABLE TO CANDIDATE</label>
                          <input type="text" className="form-control amount-dollar-bg" placeholder="Total"
                          value={stepRelatedData.subTotal} readOnly />
                          {this.state.formError.subTotal ? <p><span> {this.state.formError.subTotal} </span></p> : ''}
                        </div>
                      </div>
                    </div>
                    <h6>Estimated Payment and Deliverable Schedule</h6>
                    <ul className="hidden-xs row mb-0">
                      <li className="col-sm-4">
                        <label className="control-label">Amount Payable</label>
                      </li>
                      <li className="col-sm-4">
                        <label className="control-label">On Delivery Of</label>
                      </li>
                      <li className="col-sm-4">
                        <label className="control-label">Due Date</label>
                      </li>
                    </ul>

                    {stepRelatedData.paymentDetails.map((payment, index) =>
                      <ul className="payment-details row" key={index}>
                        <li className={payment.errorMessage ? 'global-error col-sm-4' : 'col-sm-4' }>
                          <span className="hidden visible-xs">Amount Payable</span>
                          <input type="text" className="form-control amount-dollar-bg custom-num" placeholder="Payment"
                          value={payment.rate} onChange={(e) => this.validatePaymentData(e, 'rate', index, 999999)} readOnly={isTermAccepted} />
                          <p className="static"><span>{payment.errorMessage || ''}</span></p>
                        </li>

                        <li className="col-sm-4 mb-15">
                          <span className="hidden visible-xs">On Delivery Of</span>
                          <input type="text" className="form-control" placeholder="Deliverable Description"
                          value={payment.delivery || ''} onChange={(e) => this.validatePaymentData(e, 'delivery', index, '')} readOnly={isTermAccepted} />
                        </li>

                        <li className={payment.errorMessageDueDate ? 'global-error col-sm-4' : 'col-sm-4' }>
                          <span className="hidden visible-xs">Due Date</span>
                          <div className="rdt">
                            {
                              isTermAccepted ?
                                <input type="text" className="form-control" value={payment.dueDate || ''} placeholder="Due Date" name="searchStartDate" readOnly />
                              :
                                <div>
                                  <Datetime onChange={(date) => this.validatePaymentData(date, 'dueDate', index, '')}
                                    onBlur={(e) => utils.onCalendarBlur(e)}
                                    value={payment.dueDate}
                                    input={true}
                                    inputProps={{placeholder: 'Due Date', name: 'searchStartDate', readOnly: true}}
                                    name='start_date'
                                    closeOnSelect={true}
                                    dateFormat={constant['DATE_FORMAT']}
                                    timeFormat={false}
                                    renderDay={ this.renderDay }
                                    isValidDate={ this.validDueDate }
                                    className={ 'date-time' }
                                  />
                                </div>
                            }
                          </div>
                          <p className="static"><span>{payment.errorMessageDueDate || ''}</span></p>
                        </li>
                        { (stepRelatedData.paymentDetails.length > 0  && index != 0) ?
                          <p className="less" onClick={(e) => this.removePaymentDetail(index)}>
                            <i className="fa fa-minus-circle"></i>
                            <span>Delete</span>
                          </p> :
                          <p></p>
                        }
                        { (stepRelatedData.paymentDetails.length > 0 && index == stepRelatedData.paymentDetails.length-1 && this.state.remainingAmount > 0) ?
                          <p className="add-more" onClick={(e) => this.addPaymentDetail()}>
                            <i className="fa fa-plus-circle"></i>
                            <span>Add More</span>
                          </p> :
                          <p></p>
                        }
                      </ul>
                    )}

                    <ul className="remaining-detail remaining-button-bar mb-0">
                      <li className="mb-0">
                        <label className="control-label">REMAINDER TO BE ALLOCATED </label>
                        <span className="hidden">Rate</span>
                        <input type="text" className="form-control amount-dollar-bg" placeholder="Remaining" value={this.state.remainingAmount} readOnly />
                      </li>
                    </ul>
                  </div>
                  }
                  <span className="clearfix"></span>
                </div>
                <span className="clearfix"></span>
              </form>
              {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') &&
              <div>
                <h6 className="mt-20 mb-10">Estimated Total Cost</h6>
                <p>
                  <span className="pull-left">Estimated amount payable to selected candidate:</span>
                  <span className="pull-right">{isNaN((parseFloat(stepRelatedData.subTotal)).toFixed(2))? "$00.00" : '$' + stepRelatedData.subTotal}</span>
                  <span className="clearfix"></span>
                </p>
                <p>
                  <span className="pull-left">Estimated Legably service charge:</span>
                  <span className="pull-right">{isNaN((parseFloat(this.state.legablyServiceCharges)).toFixed(2)) ? '$0.00' : '$' + parseFloat(this.state.legablyServiceCharges).toFixed(2)}</span>
                  <span className="clearfix"></span>
                </p>
                <p className="clearfix grand-total">
                  <span className="pull-left">Estimated total cost</span>
                  <span className="pull-right">{isNaN((parseFloat(stepRelatedData.total)).toFixed(2)) ? '$00.00' : '$'+parseFloat(stepRelatedData.total).toFixed(2)}</span>
                  <span className="clearfix"></span>
                </p>
              </div>
              }
              <div className="d-block remain-buttons text-right">
                {
                  this.state.highestStep === constant['JOB_STEPS']['J_COMPLETE'] ?
                    null
                  :
                    <button type="button" className="btn-primary btn" onClick={this.onSendMsgBtnClick.bind(this, stepRelatedData.seekerId)}>Send Message</button>
                }
                {
                  isTermAccepted ?
                    null
                  :
                    <button type="button" className={primaryBtn} onClick={this.submitTerms.bind(this)}>Submit Terms</button>
                }
              </div>
            </div>{/*proposed-terms*/}
            {
              isTermAccepted ?
                null
              :
              <div className="status-content proposed-terms-footer">
                <div className="separator"></div>
                <div className="btn p-0 m-0">
                  <button type="button" className={withdrawBtn} onClick={this.onWithdrawBtnClick.bind(this, jobId, (constant['JOB_STEPS']['N_TERMS'] * -1), stepRelatedData.seekerId, constant['ROLE']['POSTER'])}>Withdraw From Consideration</button>
                </div>
                <p className="d-inline-block m-0 pb-10">To remove this candidate from consideration for this job click the Withdraw From Consideration button.</p>
              </div>
            }
          </div>
        }
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div>
    );
  }
}
