import React from 'react';

import { constant, helper, utils } from '../../../../shared/index';
import ModalPopup from '../../../shared/modal-popup/ModalPopup';
import Mask from '../../../shared/plugins/mask/Mask';

let classNames = require('classnames');

export default class StartPending extends React.Component {
  constructor(props) {
    super(props);
    this.stateValueArr = [];
    this.federalTaxValueArr = [];
    this.state = {
      modalPopupObj: {},
      stepRelatedData: props.stepRelatedData,
      freezeActivity: props.freezeActivity || props.stepRelatedData.freeze_activity || false,
      stateDropdown: [],
      federalTaxDropdown: [],
      formVal: {legalName: '', address: '', city: '', state: '', zipCode: '', taxpayerIdNumber: '', federalTax: '', federalTaxOther: ''},
      formErrors: {legalName: '', address: '', city: '', state: '', zipCode: '', taxpayerIdNumber: '', federalTax: '', federalTaxOther: ''},
      stateName: '',
      federalTaxName: '',
      isEditableMode: false,
      taxpayerIdType: 'SSN',
      showFederalTaxOther: false,
      termsChecked: null,
      jobType: props.jobType,
      paymentType: props.paymentType,
    }
    this.onSendMsgBtnClick = this.onSendMsgBtnClick.bind(this);
    this.transferFunds = this.transferFunds.bind(this);
    this.setFormValue = this.setFormValue.bind(this);
    this.resetFormErrors = this.resetFormErrors.bind(this);
    this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFederalTaxChange = this.handleFederalTaxChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.onRadioBtnChange = this.onRadioBtnChange.bind(this);
    this.onTermsCheckboxChange = this.onTermsCheckboxChange.bind(this);
    this.onEditBtnClick = this.onEditBtnClick.bind(this);
    this.wNineInfoSection = this.wNineInfoSection.bind(this);
    this.onCancelBtnClick = this.onCancelBtnClick.bind(this);
    this.saveWNineInfo = this.saveWNineInfo.bind(this);
    this.onWithdrawBtnClick = this.onWithdrawBtnClick.bind(this);
    this.createStripeAccount = this.createStripeAccount.bind(this);
    this.openStripeDashboard = this.openStripeDashboard.bind(this);
  }

  componentDidMount() {
    this.isSeekerProfile() && !this.state.stepRelatedData['declined_by'] && this.getAllDropdownsData();
    if (this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee' && this.props.highestStep == constant['JOB_STEPS']['S_PENDING']) {
      if (this.isSeekerProfile()) {
        this.getPendingStepData(constant['ROLE']['POSTER'], this.props.userId, constant['JOB_STEPS']['S_PENDING']);
      } else {
        this.getPendingStepData(constant['ROLE']['SEEKER'], this.state.stepRelatedData.seekerId, constant['JOB_STEPS']['S_PENDING']);
      }
    }
  }

  isSeekerProfile() {
    return this.props.role === constant['ROLE']['SEEKER'];
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

  checkPayAvailability(pendingStepDataObj) {
    if (this.isSeekerProfile()) {
      let seekerStepData = this.state.stepRelatedData;
      if (seekerStepData.stripe_account_status == constant['STRIPE_ACCOUNT_STATUS']['ACTIVATED'] && 
          pendingStepDataObj.stripe_account_status == constant['STRIPE_ACCOUNT_STATUS']['ACTIVATED'] &&
          seekerStepData.is_w_nine_info_complete)
      {
        this.updateCandidateJobStatus(this.props.jobId, constant['JOB_STEPS']['IN_PROGRESS'], this.props.userId, null);
      }
    } else {
      let posterStepData = this.state.stepRelatedData;
      if (posterStepData.stripe_account_status == constant['STRIPE_ACCOUNT_STATUS']['ACTIVATED'] && 
          pendingStepDataObj.stripe_account_status == constant['STRIPE_ACCOUNT_STATUS']['ACTIVATED'] &&
          pendingStepDataObj.is_w_nine_info_complete)
      {
        this.updateCandidateJobStatus(this.props.jobId, constant['JOB_STEPS']['IN_PROGRESS'], this.props.userId, null);
      }
    }
  }

  transferFunds(jobId) {
    let that = this;
    let req = {
      job_id: jobId,
      user_id: that.state.stepRelatedData.seekerId,
      freeze_activity: that.state.freezeActivity
    };
    let popupType = constant['POPUP_TYPES']['CONFIRM'],
      amount = '$' + this.getFormattedAmount(that.state.stepRelatedData.amount);

    that.setState({
      modalPopupObj: {
        type: popupType,
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/info-alert-icon.svg',
        msg: constant['POPUP_MSG']['TRANSFER_FUNDS'],
        dynamicContent: [
          {
            key: 'amount',
            value: amount
          }
        ],
        noBtnText: 'Cancel',
        yesBtnText: 'Transfer',
        noBtnAction: function() { utils.modalPopup(popupType, 'hide', that) },
        yesBtnAction: function() {
          utils.apiCall('TRANSFER_FUNDS', { 'data': req }, function(err, response) {
            if (err) {
              utils.flashMsg('show', 'Error while transferring Funds');
              utils.logger('error', 'Transfer Funds Error -->', err);
            } else {
              if (utils.isResSuccess(response)) {
                helper.openSuccessMessagePopup(that, 'TRANSFER_FUND_SUCCESS', () => {
                  let stepRelatedData = that.state.stepRelatedData;
                  stepRelatedData['transfer_funds_status'] = utils.getDataFromRes(response, 'transfer_funds_status');
                  that.setState({
                    stepRelatedData: stepRelatedData,
                  });
                });
              } else if (utils.isResConflict(response)) {
                helper.openConflictPopup(that);
              } else if (utils.isResLocked(response)) {
                helper.openFreezeActivityPopup(that, 'ACCOUNT_FROZEN_POSTER');
              } else {
                utils.flashMsg('show', utils.getServerErrorMsg(response));
              }
            }
          });
        }
      }
    }, function() {
      utils.modalPopup(popupType, 'show', that);
    });
  }

  onSendMsgBtnClick(userId) {
    helper.openSendMessagePopup(this, userId);
  }

  getAllDropdownsData() {
    let that = this;
    let states = [];
    let fedTaxClassifications = [];

    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);
          that.stateValueArr = data['states'];
          that.federalTaxValueArr = data['fed_tax_classifications'];

          for (let statesObj of that.stateValueArr) {
            states.push(<option key={statesObj['_id']} value={statesObj['_id']}>{statesObj['name']}</option>);
          }

          for (let fedTaxClassificationsObj of that.federalTaxValueArr) {
            fedTaxClassifications.push(<option key={fedTaxClassificationsObj['_id']} value={fedTaxClassificationsObj['_id']}>{fedTaxClassificationsObj['name']}</option>);
          }

          that.setState({
            stateDropdown: states,
            federalTaxDropdown: fedTaxClassifications
          }, function() {
            that.setFormValue();
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  setFormValue() {
    let wNineInfo = this.state.stepRelatedData['w_nine_info'],
    formVal = this.state.formVal,
    stateName = this.state.stateName,
    federalTaxName = this.state.federalTaxName;

    let lName = wNineInfo['legal_name'],
    sAddress = wNineInfo['street_address'],
    city = wNineInfo['city'],
    state = wNineInfo['state_id'],
    zCode = wNineInfo['zipcode'],
    taxIdType, taxIdValue,
    fTaxId, fTaxOtherVal;

    if (wNineInfo['tin']) {
      taxIdType = wNineInfo['tin']['type'];
      taxIdValue = wNineInfo['tin']['value'];
    }

    if (wNineInfo['fed_tax_classification']) {
      fTaxId = wNineInfo['fed_tax_classification']['id'];
      fTaxOtherVal = wNineInfo['fed_tax_classification']['other_value'];
    }

    lName && (formVal['legalName'] = lName);
    sAddress && (formVal['address'] = sAddress);
    city && (formVal['city'] = city);
    zCode && (formVal['zipCode'] = zCode);

    if (state) {
      formVal['state'] = state;
      stateName = this.getDropdownValueFromId(state, this.stateValueArr);
    }

    if (taxIdType && taxIdValue) {
      this.setState({
        taxpayerIdType: taxIdType.toUpperCase()
      });
      formVal['taxpayerIdNumber'] = taxIdValue;
    }

    if (fTaxId) {
      formVal['federalTax'] = fTaxId;
      federalTaxName = this.getDropdownValueFromId(fTaxId, this.federalTaxValueArr);
    }

    if (fTaxOtherVal) {
      this.setState({
        showFederalTaxOther: true
      });
      formVal['federalTaxOther'] = federalTaxName = fTaxOtherVal;
    }

    this.setState({
      formVal: formVal,
      stateName: stateName,
      federalTaxName: federalTaxName
    });
  }

  resetFormErrors() {
    let formErrors = {
      legalName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      taxpayerIdNumber: '',
      federalTax: '',
      federalTaxOther: ''
    }

    this.setState({
      formErrors: formErrors,
    });
  }

  handleChange(e) {
    let name = e.target.name;
    let formVal = this.state.formVal;
    formVal[name] = e.target.value;

    this.setState({
      formVal: formVal
    }, function() {
      let val = this.state.formVal[name];
      // if (val.length <= 1) {
        this.validateField(name, val);
      // }
    });
  }

  handleFederalTaxChange(e) {
    this.handleChange(e);
    if (this.getDropdownValueFromId(e.target.value, this.federalTaxValueArr).toLowerCase() === 'other') {
      this.state.showFederalTaxOther = true;
    } else {
      this.state.showFederalTaxOther = false;
      this.state.formVal.federalTaxOther = '';
      this.state.formErrors.federalTaxOther = '';
    }
  }

  handleBlur(e) {
    let name = e.target.name;
    let val = this.state.formVal[name];
    !!val && (val = val.trim());
    this.validateField(name, val);
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    if (fieldValidationErrors.hasOwnProperty(fieldName)) {
      let vMsgkey = '';
      let dynamicContentObj = {};
      let fieldsNameObj = constant['VALIDATION_MSG']['FIELDS_NAME'];

      fieldValidationErrors[fieldName] = '';

      switch(fieldName) {
        case 'legalName':
          if (!value) {
            vMsgkey = 'REQUIRED_FIELD';
            dynamicContentObj['fieldName'] = fieldsNameObj['LEGAL_NAME'];
          } else if (!(/^[a-zA-Z \-]+$/).test(value)) {
            vMsgkey = 'ONLY_ALPHABETIC';
            dynamicContentObj['fieldName'] = fieldsNameObj['S_CASE_LEGAL_NAME'];
          } else if (value.length > fieldsNameObj['LIMIT_50']) {
            vMsgkey = 'INVALID_MAX_CHAR_LIMIT';
            dynamicContentObj['fieldName'] = fieldsNameObj['S_CASE_LEGAL_NAME'];
            dynamicContentObj['charLimit'] = fieldsNameObj['LIMIT_50'];
          }
          break;
        case 'address':
          if (!value) {
            vMsgkey = 'REQUIRED_FIELD';
            dynamicContentObj['fieldName'] = fieldsNameObj['ADDRESS'];
          } else if (value.length > fieldsNameObj['LIMIT_250']) {
            vMsgkey = 'INVALID_MAX_CHAR_LIMIT';
            dynamicContentObj['fieldName'] = fieldsNameObj['S_CASE_ADDRESS'];
            dynamicContentObj['charLimit'] = fieldsNameObj['LIMIT_250'];
          }
          break;
        case 'city':
          if (!value) {
            vMsgkey = 'REQUIRED_FIELD';
            dynamicContentObj['fieldName'] = fieldsNameObj['CITY'];
          } else if (!(/^[a-zA-Z \-]+$/).test(value)) {
            vMsgkey = 'ONLY_ALPHABETIC';
            dynamicContentObj['fieldName'] = fieldsNameObj['S_CASE_CITY'];
          } else if (value.length > fieldsNameObj['LIMIT_50']) {
            vMsgkey = 'INVALID_MAX_CHAR_LIMIT';
            dynamicContentObj['fieldName'] = fieldsNameObj['S_CASE_CITY'];
            dynamicContentObj['charLimit'] = fieldsNameObj['LIMIT_50'];
          }
          break;
        case 'state':
          if (!value) {
            vMsgkey = 'REQUIRED_DROPDOWN';
            dynamicContentObj['fieldName'] = fieldsNameObj['STATE'];
          }
          break;
        case 'zipCode':
          if (!value) {
            vMsgkey = 'REQUIRED_FIELD';
            dynamicContentObj['fieldName'] = fieldsNameObj['ZIP_CODE'];
          } else if (value.length !== 5 || !(/^[0-9]+$/).test(value)) {
            vMsgkey = 'INVALID_ZIPCODE';
          }
          break;
        case 'taxpayerIdNumber':
          if (!value) {
            vMsgkey = 'REQUIRED_FIELD';
          } else if ((this.isTaxpayerTypeSSN() && value.length !== 11) || (!this.isTaxpayerTypeSSN() && value.length !== 10)) {
            vMsgkey = 'INVALID_ENTRY';
          }
          vMsgkey && (dynamicContentObj['fieldName'] = fieldsNameObj['TAXPAYER_ID_NUMBER']);
          break;
        case 'federalTax':
          if (!value) {
            vMsgkey = 'REQUIRED_DROPDOWN';
            dynamicContentObj['fieldName'] = fieldsNameObj['FEDERAL_TAX'];
          }
          break;
        case 'federalTaxOther':
          if (this.state.showFederalTaxOther && !value) {
            vMsgkey = 'REQUIRED_OTHER_FIELD';
            dynamicContentObj['fieldName'] = fieldsNameObj['FEDERAL_TAX'];
          }
          break;
      }

      if (vMsgkey) {
        fieldValidationErrors[fieldName] = helper.getValidationMsg(vMsgkey, dynamicContentObj);
      }
    }

    let formVal = this.state.formVal;
    formVal[fieldName] = value;
    this.setState({
      formVal: formVal
    });
  }

  validateFields(callback) {
    let formErrors = this.state.formErrors;
    for (let key in formErrors) {
      let val = this.state.formVal[key];
      !!val && (val = val.trim());

      this.validateField(key, val);
    }
    this.setState({
      formErrors: formErrors,
      termsChecked: !!this.state.termsChecked
    }, callback);
  }

  validateForm(callback) {
    this.validateFields(() => {
      let formValid = !!this.state.termsChecked;
      if (formValid) {
        let formErrors = this.state.formErrors;
        for (let key in formErrors) {
          if (formErrors[key]) {
            formValid = false;
            break;
          }
        }
      }
      callback(formValid);
    });
  }

  onRadioBtnChange(e) {
    let formVal = this.state.formVal;
    formVal['taxpayerIdNumber'] = '';

    this.setState({
      taxpayerIdType: e.target.value,
      formVal: formVal
    });
  }

  onTermsCheckboxChange(e) {
    this.setState({
      termsChecked: e.target.checked
    });
  }

  onEditBtnClick() {
    if(this.state.stepRelatedData.stripe_account_status === constant['STRIPE_ACCOUNT_STATUS']['NOT_CREATED']) {
      helper.openInfoMessagePopup(this, 'CREATE_STRIPE_ACCOUNT');
    } else {
      this.wNineInfoSection('show');
    }
  }

  wNineInfoSection(action) {
    let isShow = (action === 'show');
    this.setState({
      isEditableMode: isShow,
      termsChecked: null
    });

    !isShow && window.scroll(0, 0);
  }

  onCancelBtnClick() {
    let _that = this;
    let popupType = constant['POPUP_TYPES']['CONFIRM'];
    _that.setState({
      modalPopupObj: {
        type: popupType,
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/negative-alert-icon.svg',
        msg: constant['POPUP_MSG']['CONFIRM_MSG'] + 'cancel?',
        noBtnText: 'No',
        yesBtnText: 'Yes',
        noBtnAction: function() { utils.modalPopup(popupType, 'hide', _that) },
        yesBtnAction: function() {
          utils.modalPopup(popupType, 'hide', _that);
          setTimeout(() => {
            _that.setFormValue();
            _that.resetFormErrors();
            _that.wNineInfoSection('hide');
          }, 300);
        }
      }
    }, function() {
      utils.modalPopup(popupType, 'show', _that);
    });
  }

  saveWNineInfo() {
    let _that = this;
    _that.validateForm((isFormValid) => {
      if(isFormValid) {
        let formValObj = _that.state.formVal;
        let fTaxOther = formValObj['federalTaxOther'];
        let wNineInfoObj = {
          'job_id': _that.props.jobId,
          'legal_name': formValObj['legalName'],
          'street_address': formValObj['address'],
          'city': formValObj['city'],
          'state_id': formValObj['state'],
          'zipcode': formValObj['zipCode'],
          'tin': {
            'type': _that.state.taxpayerIdType,
            'value': formValObj['taxpayerIdNumber']
          },
          'fed_tax_classification': {
            'id': formValObj['federalTax']
          }
        }
        fTaxOther && (wNineInfoObj['fed_tax_classification']['other_value'] = fTaxOther);

        utils.apiCall('SET_W_NINE_INFO', { 'data': wNineInfoObj }, function(err, response) {
          if (err) {
            utils.flashMsg('show', 'Error while saving W-9 Information');
            utils.logger('error', 'Set W-9 Info Error -->', err);
          } else {
            if (utils.isResSuccess(response)) {
              helper.openSuccessMessagePopup(_that, 'W_NINE_SUCCESS', () => {
                let resData = utils.getDataFromRes(response);
                let stepRelatedData = _that.state.stepRelatedData;
                stepRelatedData['is_w_nine_info_complete'] = resData['is_w_nine_info_complete'];
                stepRelatedData['w_nine_info'] = resData['w_nine_info'];
                _that.setState({
                  stepRelatedData: stepRelatedData,
                  stateName: _that.getDropdownValueFromId(formValObj['state'], _that.stateValueArr),
                  federalTaxName: fTaxOther || _that.getDropdownValueFromId(formValObj['federalTax'], _that.federalTaxValueArr)
                }, function() {
                  let hStep = resData['current_highest_job_step'];
                  if (_that.state.jobType == '1099' && _that.state.paymentType == 'Hourly Rate/Fixed Fee' && hStep == constant['JOB_STEPS']['S_PENDING']) {
                    _that.getPendingStepData(constant['ROLE']['POSTER'], _that.props.userId, constant['JOB_STEPS']['S_PENDING']);
                  } else {
                    _that.props.handler(hStep, hStep);
                    setTimeout(() => {
                      _that.wNineInfoSection('hide');
                    }, 300);
                  }

                });
              });
            } else {
              utils.flashMsg('show', utils.getServerErrorMsg(response));
            }
          }
        });
      } else {
        utils.logger('warn', 'Invalid Form');
      }
    });
  }

  getDropdownValueFromId(id, arrOfObj) {
    let result = arrOfObj.filter((obj) => {
      return obj['_id'] === id;
    });
    return (result && result.length && result[0]['name']) || '';
  }

  isTaxpayerTypeSSN() {
    return (this.state.taxpayerIdType === 'SSN');
  }

  onWithdrawBtnClick(jobId, action, userId, withdrawBy) {
    helper.openDeclineCandidatePopup(this, () => {
      this.updateCandidateJobStatus(jobId, action, userId, withdrawBy);
    }, withdrawBy);
  }

  updateCandidateJobStatus(jobId, action, userId, withdrawBy) {
    let that = this;
    let req = {
      job_id: jobId,
      status: action,
      freeze_activity: that.state.freezeActivity
    };
    !that.isSeekerProfile() && (req['user_id'] = userId);
    utils.apiCall('UPDATE_JOB_STATUS', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while performing Withdraw From Consideration action');
        utils.logger('error', 'Update Job Status Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          if (that.isSeekerProfile()) {
            let stepData = {
              'declined_by': constant['ROLE']['SEEKER']
            };
            that.setState({
              'stepRelatedData': stepData
            }, function() {
              window.scroll(0, 0);
            });
          }

          let hStep = utils.getDataFromRes(response, 'current_highest_job_step');
          that.props.handler(req['status'], hStep);
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

  createStripeAccount(jobId, role) {
    let that = this;
    let req = {
      job_id: jobId,
      freeze_activity: that.state.freezeActivity
    }
    let isSeekerProfile = that.isSeekerProfile();
    if (!isSeekerProfile) {
      req['user_id'] = that.state.stepRelatedData.seekerId;
    }
    utils.apiCall('GET_CREATE_STRIPE_ACCOUNT_LINK', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting create stripe account link');
        utils.logger('error', 'Get Create Stripe Account Link Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          window.location.href = utils.getDataFromRes(response, 'url');
        } else if (utils.isResConflict(response)) {
          helper.openConflictPopup(that);
        } else if (utils.isResLocked(response)) {
          let key = isSeekerProfile ? 'ACCOUNT_FROZEN_SEEKER' : 'ACCOUNT_FROZEN_POSTER';
          helper.openFreezeActivityPopup(that, key);
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  openStripeDashboard() {
    let that = this;
    let req = {
      freeze_activity: that.state.freezeActivity
    }
    if (!this.isSeekerProfile()) {
      req['user_id'] = that.state.stepRelatedData.seekerId;
    }
    utils.apiCall('GET_STRIPE_DASHBOARD_LINK', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting stripe dashboard link');
        utils.logger('error', 'Get Stripe Dashboard Link Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          window.open(utils.getDataFromRes(response, 'url'), '_blank');
        } else if (utils.isResConflict(response)) {
          helper.openConflictPopup(that);
        } else if (utils.isResLocked(response)) {
          let key = (that.isSeekerProfile()) ? 'ACCOUNT_FROZEN_SEEKER' : 'ACCOUNT_FROZEN_POSTER';
          helper.openFreezeActivityPopup(that, key);
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  getFormattedAmount(amount) {
    return utils.getFormattedAmount(amount);
  }

  render() {
    let stepRelatedData = this.state.stepRelatedData,
    formValObj = this.state.formVal,
    formErrors = this.state.formErrors,
    jobId = this.props.jobId,
    highestStep = this.props.highestStep,
    isFundsNotTransfer = (stepRelatedData.transfer_funds_status === constant['PAYMENT_STATUS']['FUND_TRANSFER_REQUEST_NOT_SENT']),
    isStripeAccountNotCreated = (stepRelatedData.stripe_account_status === constant['STRIPE_ACCOUNT_STATUS']['NOT_CREATED']),
    seizedBtn = this.state.freezeActivity || false,
    routesPath = constant['ROUTES_PATH'];

    let yellowBtnClass = classNames({
      'btn yellow-btn ml-25 mt-10': true,
      'seized-btn': seizedBtn
    });

    let primaryBtnClass = classNames({
      'btn btn-primary mt-10 mb-20 ml-25': true,
      'seized-btn': seizedBtn
    });

    let withdrawBtn = classNames({
      'btn-grey btn mr-15': true,
      'seized-btn': seizedBtn
    });

    return (
      <div>
        { this.isSeekerProfile() ?
            highestStep === (constant['JOB_STEPS']['S_PENDING'] * -1) ?
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
                <div className="status-content mt-45">
                  {
                    isStripeAccountNotCreated ?
                      <div>
                        <p className="d-flex">
                          <i className="fa fa-exclamation-circle"></i>
                          <span className="pl-10">
                            <span className="d-block mb-20">
                            Legably uses Stripe Connect to handle milestone payments between job posters and job seekers (see our <a href={routesPath['FAQ']} target="_blank">FAQ</a> for details). In order to do this you will need to create a Stripe account by clicking on the Create Stripe Account button below. This will send you to the Stripe site where you will create your account, complete your profile, and setup your payment preferences.
                            </span>
                            <span className="d-block">
                            After you complete these actions you will be returned to the Legably site. Your Stripe account information will be securely linked with your Legably account and kept private (see our <a href={routesPath['PRIVACY_POLICY']} target="_blank">Privacy Policy</a> for details). If you have any additional questions about Legably's relationship with Stripe that our FAQ or Privacy Policy doesn't answer please contact the Legably support team at <a href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a>.
                            </span>
                          </span>
                        </p>
                        <button type="button" className={primaryBtnClass} onClick={this.createStripeAccount.bind(this, jobId, constant['ROLE']['SEEKER'])}>
                          Create Stripe Account
                        </button>
                      </div>
                    :
                      <div>
                        <p className="d-flex">
                          <i className="fa fa-check-circle"></i>
                          <span className="pl-10">Thank you for setting up your Stripe account. If you need to change any of your Stripe account information please click the Access Stripe Dashboard button below. If you have any additional questions about Legably's relationship with Stripe that our FAO or Privacy Policy doesn't answer please contact the Legably support team at <a href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a>.</span>
                        </p>
                        <button type="button" className={primaryBtnClass} onClick={this.openStripeDashboard}>
                          Access Stripe Dashboard
                        </button>
                      </div>
                  }
                  { stepRelatedData.is_w_nine_info_complete ?
                      <p className="d-flex">
                        <i className="fa fa-check-circle"></i>
                        <span className="pl-10">
                          <span className="d-block mb-20">
                            Thank you for providing your W-9 tax information.
                          </span>
                          {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') &&
                            <span className="d-block">
                              Once the job poster has transferred the job amount to Legably the job status will be changed to In Progress and you will be notified so you can begin work.
                            </span>
                          }
                        </span>
                      </p>
                    :
                      <p className="d-flex">
                        <i className="fa fa-exclamation-circle"></i>
                        <span className="pl-10">Please update your W-9 tax information by clicking the Edit button. This information is required in order for you to get paid when milestones are approved.</span>
                      </p>
                  }
                  {
                    this.state.isEditableMode ?
                      <form id="editable_form" className="editable-form">
                        <div className="d-flex justify-content-between mb-15">
                          <h4>W-9 Tax Information</h4>
                        </div>
                        <div className={formErrors.legalName ? 'form-group global-error' : 'form-group'}>
                          <label htmlFor="legal_name">Legal Name*</label>
                          <input type="text" className="form-control" name="legalName" placeholder="Provide the same name as shown on your tax return" autoComplete="legal_name"
                            value={formValObj.legalName}
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                          />
                          { formErrors.legalName ?
                              <p>
                                <span>{formErrors.legalName}</span>
                              </p>
                            :
                              null
                          }
                        </div>
                        <div className={formErrors.address ? 'form-group global-error' : 'form-group'}>
                          <label htmlFor="address">Address*</label>
                          <input type="text" className="form-control" name="address" placeholder="Address" autoComplete="address"
                            value={formValObj.address}
                            onBlur={this.handleBlur}
                            onChange={this.handleChange}
                          />
                          { formErrors.address ?
                              <p>
                                <span>{formErrors.address}</span>
                              </p>
                            :
                              null
                          }
                        </div>
                        <div className="row">
                          <div className={formErrors.city ? 'form-group col-sm-4 global-error' : 'form-group col-sm-4'}>
                            <label htmlFor="city">City*</label>
                            <input type="text" className="form-control" name="city" placeholder="City" autoComplete="city"
                              value={formValObj.city}
                              onBlur={this.handleBlur}
                              onChange={this.handleChange}
                            />
                            { formErrors.city ?
                                <p>
                                  <span>{formErrors.city}</span>
                                </p>
                              :
                                null
                            }
                          </div>
                          <div className={formErrors.state ? 'form-group col-sm-4 global-error' : 'form-group col-sm-4'}>
                            <label htmlFor="state">State*</label>
                            <select className="form-control" name="state" value={formValObj.state} onBlur={this.handleBlur} onChange={this.handleChange}>
                              <option value="">Select State</option>
                              {this.state.stateDropdown}
                            </select>
                            { formErrors.state ?
                                <p>
                                  <span>{formErrors.state}</span>
                                </p>
                              :
                                null
                            }
                          </div>
                          <div className={formErrors.zipCode ? 'form-group col-sm-4 global-error' : 'form-group col-sm-4'}>
                            <label htmlFor="zip_code">Zip Code*</label>
                            <input type="text" className="form-control" name="zipCode" placeholder="Zip Code" autoComplete="zip_code"
                              value={formValObj.zipCode}
                              onBlur={this.handleBlur}
                              onChange={this.handleChange}
                            />
                            { formErrors.zipCode ?
                                <p>
                                  <span>{formErrors.zipCode}</span>
                                </p>
                              :
                                null
                            }
                          </div>
                        </div>
                        <div className={formErrors.taxpayerIdNumber ? 'form-group group-radio global-error' : 'form-group group-radio'}>
                          <label htmlFor="TIN">
                            Taxpayer Identification Number*
                          </label>
                          <div className="radio-btns mb-5">
                            <ul className="list radio-list m-0 p-0">
                              <li className="list__item">
                                <input id="ssn" type="radio" className="radio-btn" name="taxpayerIdNumber" value='SSN' checked={this.isTaxpayerTypeSSN()} onChange={(e) => this.onRadioBtnChange(e)} />
                                <label htmlFor="ssn" className="label p-0">Social Security Number (SSN)</label>
                              </li>
                              <li className="list__item m-10 ml-0">
                                <input id="ein" type="radio" className="radio-btn" name="taxpayerIdNumber" value="EIN" checked={!this.isTaxpayerTypeSSN()} onChange={(e) => this.onRadioBtnChange(e)} />
                                <label htmlFor="ein" className="label p-0">Employer Identification Number (EIN)</label>
                              </li>
                            </ul>
                          </div>
                          <Mask dataValue={formValObj.taxpayerIdNumber} isReverse={false} mask={this.isTaxpayerTypeSSN() ? "000-00-0000" : "00-0000000"} nameValue="taxpayerIdNumber" placeholderValue={this.isTaxpayerTypeSSN() ? "xxx-xx-xxxx" : "xx-xxxxxxx"} onMaskBlur={this.handleBlur} onMaskChange={this.handleChange} />
                          { formErrors.taxpayerIdNumber ?
                              <p>
                                <span>{formErrors.taxpayerIdNumber}</span>
                              </p>
                            :
                              null
                          }
                        </div>
                        <div className={formErrors.federalTax ? 'form-group global-error' : 'form-group'}>
                          <label htmlFor="sel_tax">Federal tax classification*</label>
                          <select className="form-control sel-tax" id="sel_tax" name="federalTax" value={formValObj.federalTax} onBlur={this.handleBlur} onChange={this.handleFederalTaxChange}>
                            <option value="">Select Federal Tax Classification</option>
                            {this.state.federalTaxDropdown}
                          </select>
                          { formErrors.federalTax ?
                              <p>
                                <span>{formErrors.federalTax}</span>
                              </p>
                            :
                              null
                          }
                        </div>
                        { this.state.showFederalTaxOther ?
                            <div className={formErrors.federalTaxOther ? 'form-group global-error mt-minus-10' : 'form-group mt-minus-10'}>
                              <input type="text" className="form-control" name="federalTaxOther" placeholder="" autoComplete="federal_tax_other"
                                value={formValObj.federalTaxOther}
                                onBlur={this.handleBlur}
                                onChange={this.handleChange}
                              />
                              { formErrors.federalTaxOther ?
                                  <p>
                                    <span>{formErrors.federalTaxOther}</span>
                                  </p>
                                :
                                  null
                              }
                            </div>
                          :
                            null
                        }
                        <div className={this.state.termsChecked === false ? 'i-certify not-certified' : 'i-certify'}>
                          <div className="d-inline-flex">
                            <label className="pmd-checkbox d-flex mb-0">
                              <input name="terms" type="checkbox" checked={!!this.state.termsChecked} onChange={this.onTermsCheckboxChange} />
                              <span className="pmd-checkbox-label">&nbsp;</span>
                              <p className="mb-0">
                                I certify, under penalties of perjury, that;
                              </p>
                            </label>
                          </div>
                          <div className="pl-30">
                            <p className="mt-15">
                              1. The number shown on this form is my correct taxpayer identification number (or I am waiting for a number to be issued to me); and
                            </p>
                            <p>
                              2. I am not subject to backup withholding because: (a) I am exempt from backup withholding, or (b) I have not been notified by the Internal Revenue Service (IRS) that I am subject to backup withholding as a result of a failure to report all interest or dividends, or (c) The IRS has notified me that I am no longer subject to withholding; and
                            </p>
                            <p>
                              3. I am a U.S. citizen or other U.S. person.
                            </p>
                            <p>
                              <b>Note:</b> Only check this certification if all of these items are true, otherwise contact <a href={routesPath['SUPPORT_CENTER']} target="_blank">Customer Support</a>.
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-row-reverse mb-15">
                          <div className="btns">
                            <button type="button" className="btn btn-grey" onClick={this.onCancelBtnClick}>Cancel</button>
                            <button type="button" className="btn btn-primary mb-0" onClick={() => this.saveWNineInfo()}>Save</button>
                          </div>
                        </div>
                      </form>
                    :
                      <form id="filled_form" className="info-form form-horizontal mt-25">
                        <div className="d-flex justify-content-between mb-15">
                          <h4>W-9 Tax Information</h4>
                          <div className="btns">
                            <button type="button" className="btn btn-primary" onClick={() => this.onEditBtnClick()}>Edit</button>
                          </div>
                        </div>
                        <div className="form-group row mb-15">
                          <label htmlFor="leg-name" className="control-label col-sm-3 col-md-2">Legal Name</label>
                          <div className="col-sm-9 col-md-10">
                            <p>
                              { formValObj.legalName ?
                                  formValObj.legalName
                                :
                                  <i className="fa fa-exclamation-circle"></i>
                              }
                            </p>
                          </div>
                        </div>
                        <div className="form-group row mb-15">
                          <label htmlFor="address"  className="control-label col-sm-3 col-md-2">Address</label>
                          <div className="col-sm-9 col-md-10">
                            <p>{formValObj.address}, {formValObj.city}, {this.state.stateName}, {formValObj.zipCode}</p>
                          </div>
                        </div>
                        <div className="form-group row mb-15">
                          <label htmlFor="tin" className="control-label col-sm-3 col-md-2">Taxpayer Identification Number</label>
                          <div className="col-sm-9 col-md-10">
                            <p>
                              { formValObj.taxpayerIdNumber ?
                                  this.isTaxpayerTypeSSN() ?
                                    '###-##-####'
                                  :
                                    '##-#######'
                                :
                                  <i className="fa fa-exclamation-circle"></i>
                              }
                            </p>
                          </div>
                        </div>
                        <div className="form-group row mb-0">
                          <label htmlFor="ftc" className="control-label col-sm-3 col-md-2">Federal Tax Classification</label>
                          <div className="col-sm-9 col-md-10">
                            <p>
                              { formValObj.federalTax ?
                                  this.state.federalTaxName
                                :
                                  <i className="fa fa-exclamation-circle"></i>
                              }
                            </p>
                          </div>
                        </div>
                      </form>
                  }
                  <div className="preference-msg-btns">
                    {
                      highestStep === constant['JOB_STEPS']['J_COMPLETE'] ?
                        null
                      :
                        <button type="button" className="btn btn-primary m-0 ml-auto" onClick={this.onSendMsgBtnClick.bind(this, null)}>
                          Send Message
                        </button>
                    }
                  </div>
                  {
                    highestStep > constant['JOB_STEPS']['S_PENDING'] ?
                      null
                    :
                      <div className="status-content proposed-terms-footer">
                        <div className="separator"></div>
                        <div className="btn p-0 m-0">
                          <button type="button" className={withdrawBtn} onClick={this.onWithdrawBtnClick.bind(this, jobId, (constant['JOB_STEPS']['S_PENDING'] * -1), null, constant['ROLE']['SEEKER'])}>Withdraw From Consideration</button>
                        </div>
                        <p className="d-inline-block m-0">To remove yourself from consideration for this job click the Withdraw From Consideration button.</p>
                      </div>
                  }
                </div>
              )
          :
            <div className="status-content mt-45">
              { isStripeAccountNotCreated ?
                  <div>
                    <p className="d-flex">
                      <i className="fa fa-exclamation-circle"></i>
                      <span className="pl-10">
                        <span className="d-block mb-20">
                        Legably uses Stripe Connect to handle milestone payments between job posters and job seekers (see our <a href={routesPath['FAQ']} target="_blank">FAQ</a> for details). In order to do this you will need to create a Stripe account by clicking on the Create Stripe Account button below. This will send you to the Stripe site where you will create your account, complete your profile, and setup your payment preferences.
                        </span>
                        <span className="d-block">
                        After you complete these actions you will be returned to the Legably site. Your Stripe account information will be securely linked with your Legably account and kept private (see our <a href={routesPath['PRIVACY_POLICY']} target="_blank">Privacy Policy</a> for details). If you have any additional questions about Legably's relationship with Stripe that our FAQ or Privacy Policy doesn't answer please contact the Legably support team at <a href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a>.
                        </span>
                      </span>
                    </p>
                    <button type="button" className={primaryBtnClass} onClick={this.createStripeAccount.bind(this, jobId, constant['ROLE']['POSTER'])}>
                      Create Stripe Account
                    </button>
                  </div>
                :
                  <div>
                    <p className="d-flex">
                      <i className="fa fa-check-circle"></i>
                      <span className="pl-10">Thank you for setting up your Stripe account. If you need to change any of your Stripe account information please click the Access Stripe Dashboard button below. If you have any additional questions about Legably's relationship with Stripe that our FAO or Privacy Policy doesn't answer please contact the Legably support team at <a href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a></span>
                    </p>
                    <button type="button" className={primaryBtnClass} onClick={this.openStripeDashboard}>
                      Access Stripe Dashboard
                    </button>
                  </div>
              }
              {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') &&
                (
                  isFundsNotTransfer ?
                  <div>
                    <p className="d-flex">
                      <i className="fa fa-exclamation-circle"></i>
                      <span className="pl-10">Please click the Transfer Funds button to transfer the amount of ${this.getFormattedAmount(stepRelatedData.amount)} to Legably and start the job.</span>
                    </p>
                    <button type="button" className={yellowBtnClass} disabled={stepRelatedData.stripe_account_status !== constant['STRIPE_ACCOUNT_STATUS']['ACTIVATED']} onClick={this.transferFunds.bind(this, jobId)}>
                      Transfer Funds
                    </button>
                  </div>
                  :
                  <p className="d-flex">
                    <i className="fa fa-check-circle"></i>
                    <span className="pl-10">The transfer of ${this.getFormattedAmount(stepRelatedData.amount)} to Legably has been started. Once the transfer is complete (it can take up to two days) the job status will be changed to In Progress and your candidate will be notified so they can begin work.</span>
                  </p>
                )
              }
              <div className="preference-msg-btns pl-25">
                {
                  highestStep === constant['JOB_STEPS']['J_COMPLETE'] ?
                    null
                  :
                    <button type="button" className="btn btn-primary" onClick={this.onSendMsgBtnClick.bind(this, stepRelatedData.seekerId)}>
                      Send Message
                    </button>
                }
              </div>
              {
                highestStep > constant['JOB_STEPS']['S_PENDING'] ?
                  null
                :
                  <div className="status-content proposed-terms-footer">
                    <div className="separator"></div>
                    <div className="btn p-0 m-0">
                      <button type="button" className={withdrawBtn} onClick={this.onWithdrawBtnClick.bind(this, jobId, (constant['JOB_STEPS']['S_PENDING'] * -1), stepRelatedData.seekerId, constant['ROLE']['POSTER'])}>Withdraw From Consideration</button>
                    </div>
                    <p className="d-inline-block m-0">To remove this candidate from consideration for this job click the Withdraw From Consideration button.</p>
                  </div>
              }
            </div>
        }
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div>
    );
  }
}
