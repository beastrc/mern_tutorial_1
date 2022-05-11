import React from 'react';
import { Link } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import Datetime from 'react-datetime';
import moment from 'moment';
let classNames = require('classnames');

import { constant, helper, utils, cookieManager } from '../../../../shared/index';
import ModalPopup from '../../../shared/modal-popup/ModalPopup';

export default class PostJobComp extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      job: {
        jobType: '',
        paymentType: '',
        jobHeadline:'',
        practiceArea: [],
        skillsNeeded:[],
        others:'',
        showOthers: false,
        jobDescription:'',
        city:'',
        state:'',
        zipCode:'',
        estimatedStartDate:'',
        duration:'',
        durationPeriod: utils.ENUM.DURATION_PERIOD.DAYS,
        rate:'',
        rateType: utils.ENUM.RATE_TYPE.HOURLY,
        hours:'',
        hoursType: '',
        subTotal: '',
        total: '',
        remainingAmount: '',
        paymentDetails: [
          {rate: '', delivery: '', dueDate: ''}
        ],
        setting_id: '',
        currentRate: ''
      },
      diableHours: false,
      formError: {},
      practice_area_dropdown:[],
      skill_dropdown: [],
      state_dropdown: [],
      work_location_dropdown: [],
      job_type_dropdown: [],
      // payment_type_dropdown: [],
      employment_type_dropdown:[],
      zipErr: '',
      // legablyChargesForFixed : 0,
      profileComplete : false,
      modalPopupObj: {},
      defaultJobType: '',
      defaultPaymentType: ''
    };
    this.changeInput = this.changeInput.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.validateLength = this.validateLength.bind(this);
    // this.validateAndCalculateAmount = this.validateAndCalculateAmount.bind(this);
    // this.calculateAmount = this.calculateAmount.bind(this);
    // this.removePaymentDetail = this.removePaymentDetail.bind(this);
    // this.addPaymentDetail = this.addPaymentDetail.bind(this);
    // this.setPaymentDetails = this.setPaymentDetails.bind(this);
    // this.calculateRemainingAmount = this.calculateRemainingAmount.bind(this);
    this.validateForm = this.validateForm.bind(this);
    // this.onChangeHoursType = this.onChangeHoursType.bind(this);
    this.setStateKeyVal = this.setStateKeyVal.bind(this);
    this.handleDueDate = this.handleDueDate.bind(this);
    // this.getServiceCharge = this.getServiceCharge.bind(this);
    this.getJobPost = this.getJobPost.bind(this);
    this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.logChangeSkills = this.logChangeSkills.bind(this);
  }

  componentDidMount() {
    $('.job-posting-card').on('keydown', '.custom-num', function(evt) {
      var evtKey = evt.key && (evt.key).toLowerCase();
      if ( evtKey == '.' || evtKey == 'decimal') {
        return ($(this).val().indexOf('.') == -1);
      }
    });
    // this.getServiceCharge();
    this.getAllDropdownsData();
    if (this.props.isEditJobPage && this.props.jobId) {
      this.getJobPost(this.props.jobId);
    }
  }

  getAllDropdownsData() {
    let that = this;
    let practiceAreas = [];
    let skills = [];
    let states = [];
    let workLocations = [];
    let employmentTypes = [];
    let jobTypes = [];
    // let paymentTypes = [];

    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);

          var stateObj = that.state.job;
          stateObj['jobType'] = data['job_types'][0]['name'];
          stateObj['paymentType'] = data['payment_types'][0]['name'];
          that.setState({
            job: stateObj,
            defaultJobType: data['job_types'][0]['name'],
            defaultPaymentType: data['payment_types'][0]['name']
          });

          for (let jobTypeObj of data['job_types']) {
            jobTypes.push(<option key={jobTypeObj['_id']} value={jobTypeObj['name']}>{jobTypeObj['name']}</option>);
          }
          that.setState({job_type_dropdown: jobTypes});

          // for (let paymentTypeObj of data['payment_types']) {
          //   paymentTypes.push(<option key={paymentTypeObj['_id']} value={paymentTypeObj['name']}>{paymentTypeObj['name']}</option>);
          // }
          // that.setState({payment_type_dropdown: paymentTypes});

          for (let pAreasObj of data['practice_areas']) {
            practiceAreas.push({value: pAreasObj['_id'], label: pAreasObj['name']});
          }
          that.setState({practice_area_dropdown: practiceAreas});

          for (let skillsObj of data['skills']) {
            skills.push({value: skillsObj['_id'], label: skillsObj['name']});
          }
          that.setState({skill_dropdown: skills});

          for (let statesObj of data['states']) {
            states.push(<option key={statesObj['_id']} value={statesObj['_id']}>{statesObj['name']}</option>);
          }
          that.setState({state_dropdown: states});

          for (let workLocationsObj of data['work_locations']) {
            workLocations.push(<option key={workLocationsObj['_id']} value={workLocationsObj['_id']}>{workLocationsObj['name']}</option>);
          }
          that.setState({work_location_dropdown: workLocations});

          var stateObj = that.state.job;
          for (let eTypesObj of data['employment_types']) {

            if (eTypesObj['name'] === 'Part-time'){
              employmentTypes[0] = ({value: eTypesObj['_id'], label: eTypesObj['name']});
            } else if(eTypesObj['name'] === 'Full-time') {
              employmentTypes[1] = ({value: eTypesObj['_id'], label: eTypesObj['name']});
            }
          }
          that.setState({employment_type_dropdown: employmentTypes}, function(){
            stateObj.hoursType = that.state.employment_type_dropdown[0]['value'];
            that.setState({job: stateObj});
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  // getServiceCharge(){
  //   let that = this;
  //   utils.apiCall('GET_SERVICE_CHARGE', {}, function(err, response) {
  //     if (err) {
  //       utils.flashMsg('show', 'Error while getting Service Charge');
  //       utils.logger('error', 'Get Service Charge Error -->', err);
  //     } else {
  //       if (utils.isResSuccess(response)) {
  //         let data = utils.getDataFromRes(response);
  //         var stateObj = that.state.job;
  //         stateObj.currentRate = Number(data['service_charge']);
  //         that.setState({job: stateObj});
  //       } else {
  //         utils.flashMsg('show', utils.getServerErrorMsg(response));
  //       }
  //     }
  //   });
  // }

  setStateKeyVal (key, val) {
    var obj = {};
    obj[key] = val;

    this.setState(obj);
  }

  changeInput (ev, key) {
    var val = ev.target.value;
    var stateObj = this.state.job;
    stateObj[key] = val;
    this.setState({job: stateObj});
  }

  handleOnBlur (ev, key) {
    var formError = this.state.formError;
    var val = ev.target.value;

    formError[key] = false;
    if (key =='zipCode') {
      if (val) {
        var text = /^[0-9]+$/;
        if (val.length == 5 ) {
          if (!text.test(val)) {
            this.setState({zipErr:constant.INVALID_ZIPCODE}) ;
            formError[key] = true;
          } else {
            this.setState({zipErr:''});
          }
        } else {
          this.setState({zipErr:constant.INVALID_ZIPCODE});
          formError[key] = true;
        }
      } else {
        this.setState({zipErr:constant.ENTER_ZIPCODE});
        formError[key] = true;
      }
    } else if (key === 'duration') {
      if (!val) {
        formError[key] = constant['ENTER_DURATION'];
      } else if (!(Number(val))) {
        formError[key] = constant['DURATION_ERROR'];
      }
    } 
    // else if (key === 'rate') {
    //   if (!val) {
    //     formError[key] = constant['ENTER_RATE'];
    //   } else if (!(Number(val))) {
    //     formError[key] = constant['RATE_ERROR'];
    //   }
    // } 
    else if (key === 'hours') {
      if (!val) {
        formError[key] = constant['ENTER_HOURS'];
      } else if (!(Number(val))) {
        formError[key] = constant['HOURS_ERROR'];
      }
    } else if(!val){
      formError[key] = true;
    }
    this.setState({formError: formError});
  }

  handleMultiSelectOnBlur (ev, key) {
    var formError = this.state.formError;
    var val = this.state.job[key];
    formError[key] = false;
    if (!val.length) {
      formError[key] = true;
    }
    this.setState({formError: formError});
  }

  setMultiSelectValues (val, key) {
    var formError = this.state.formError;
    var stateObj = this.state.job;
    var _this = this;
    stateObj[key] = val;
    this.setState({job: stateObj}, function() {
      if(!stateObj[key].length){
        formError[key] = 'Please select practice area';
      }
      else{
        formError[key] = '';
      }
      _this.setState({formError});
    });
  }

  logChangeSkills(val, type) {
    var list = [];
    var flag = false;
    var formError = this.state.formError;
    var stateObj = this.state.job;
    if (val.length === 0) {
      formError[type] = true;
      stateObj['showOthers'] = false;
      stateObj['others'] = '';
    } else {
      formError[type] = '';
      for(var key in val){
        list.push(val[key].value);
        if(val[key].label == 'Other'){
          flag = true;
        }
      }
    }
    if (flag) {
      stateObj['showOthers'] = true;
    } else {
      stateObj['showOthers'] = false;
      stateObj['others'] = '';
    }
    stateObj[type] = val;
    this.setState({job: stateObj, formError: formError});
  }

  handleStartDateChange(date) {
    var stateObj = this.state.job;
    date = moment.isMoment(date) ? date.format(constant['DATE_FORMAT']): date;
    stateObj.estimatedStartDate = date;
    this.setState({job: stateObj});
  }

  handleDueDate (date, index) {
    let stateObj = Object.assign({}, this.state.job);
    date = moment.isMoment(date) ? date.format(constant['DATE_FORMAT']): date;
    stateObj.paymentDetails[index].dueDate = date;
    this.setState({job: stateObj});
  }

  validateLength (ev, key, maxValue) {
    var val = ev.target.value + '';
    var maxLen = String(maxValue).length;
    if (ev.target.name !== 'zipCode') {
      val = val.replace(/[^0-9.]/g, "");
      val = val.substr(0, (maxValue+'').length);
    }
    var stateObj = this.state.job;
    stateObj[key] = val;
    this.setState({job: stateObj});
  }

  // onChangeHoursType (ev, key) {
  //   var stateObj = this.state.job;
  //   if ( utils.ENUM.RATE_TYPE.FIXED == stateObj.rateType ) {
  //     stateObj.hours = '';
  //   }
  //   this.changeInput(ev, key);
  //   this.calculateAmount();
  // }

  // validateAndCalculateAmount (ev, key, limit) {
  //   this.validateLength(ev, key, limit);
  //   this.calculateAmount();
  // }

  // calculateAmount () {
  //   var _this = this;
  //   var stateObj = this.state.job;
  //   var paymentDetail = stateObj.paymentDetails;
  //   var formError = this.state.formError;

  //   setTimeout(function() {
  //     var subtotal = utils.ENUM.RATE_TYPE.FIXED == stateObj.rateType ? (stateObj.rate || 0) : (stateObj.rate || 0) * (stateObj.hours || 0);

  //     isNaN(subtotal) && (subtotal = 0);
  //     stateObj.subTotal = parseFloat(subtotal).toFixed(2);
  //     formError.subTotal = (stateObj.subTotal < 100) ? constant['MIN_JOB_AMOUNT'] : false;
  //     var total = parseFloat(stateObj.subTotal) + parseFloat(parseFloat(stateObj.subTotal * stateObj.currentRate / 100).toFixed(2));

  //     stateObj.total = total;
  //     _this.setState({ legablyChargesForFixed : parseFloat(subtotal * stateObj.currentRate/100).toFixed(2)});
  //     if(utils.ENUM.RATE_TYPE.FIXED == stateObj.rateType) {
  //       stateObj.hours = 0
  //       _this.setStateKeyVal('diableHours', true);
  //       formError.hours = false;
  //     } else {
  //       _this.setStateKeyVal('diableHours', false)
  //     }
  //     stateObj.paymentDetails = [{rate: '', delivery: '', dueDate: ''}];
  //     _this.setState({formError});
  //     _this.setState({job: stateObj});
  //     _this.calculateRemainingAmount();
  //   }, 0);
  // }

  // calculateRemainingAmount (index,key) {
  //   var stateObj = this.state.job;

  //   var paymentDetail = stateObj.paymentDetails;
  //   var total = stateObj.subTotal;
  //   var totalRate = 0;

  //   paymentDetail.forEach((payment) => {
  //       !isNaN(payment.rate) && (totalRate += Number(payment.rate || 0));
  //   });

  //   var remainingAmount = parseFloat(total - totalRate);

  //   if(remainingAmount < 0) {
  //     remainingAmount = 0;
  //     paymentDetail.forEach((payment) => {
  //       payment.errorMessage = 'Rate should not exceed the total amount';
  //     });
  //   } else {
  //     paymentDetail.forEach((payment) => {
  //       payment.errorMessage = '';
  //     });
  //   }

  //   var stateObj = this.state.job;
  //   stateObj.remainingAmount = (parseFloat(remainingAmount)).toFixed(2);

  //   this.setState({job: stateObj});
  // }

  // removePaymentDetail (index) {
  //   var stateObj = this.state.job;

  //   var paymentDetail = stateObj.paymentDetails;
  //   paymentDetail.splice(index, 1);

  //   stateObj.paymentDetails = paymentDetail;
  //   this.setState({job: stateObj});
  //   this.calculateRemainingAmount();
  // }

  // addPaymentDetail () {
  //   var stateObj = this.state.job;

  //   var paymentDetail = stateObj.paymentDetails;
  //   paymentDetail.push({rate: '', delivery: '', dueDate: ''});

  //   stateObj.paymentDetails = paymentDetail;
  //   this.setState({job: stateObj});
  //   this.calculateRemainingAmount();
  // }

  // setPaymentDetails (ev, key, index) {
  //   var stateObj = this.state.job;

  //   var val = ev.target.value;
  //   (key != 'delivery') && (val = val.replace(/[^0-9.]/g, ""));
  //   var paymentDetail = stateObj.paymentDetails;
  //   var totalRate = 0;
  //   var prevVal = paymentDetail[index][key];

  //   paymentDetail.forEach((payment) => {
  //     payment.errorMessage = '';
  //   });


  //   if(key == 'delivery') {
  //     paymentDetail[index][key] = val;

  //     stateObj.paymentDetails = paymentDetail;
  //     this.setState({job: stateObj});

  //     return;
  //   }

  //   if(stateObj.total === '') {
  //     paymentDetail[index].errorMessage = 'Please fill rate and hours';

  //     stateObj.paymentDetails = paymentDetail;
  //     this.setState({job: stateObj});
  //     return;
  //   }

  //   paymentDetail[index][key] = val;

  //   paymentDetail.forEach((payment) => {
  //     !isNaN(payment.rate) && (totalRate += Number(payment.rate || 0));
  //   });

  //   if(Number(parseFloat(totalRate).toFixed(2)) > Number(stateObj.subTotal)) {
  //     paymentDetail.forEach((payment) => {
  //       payment.errorMessage = 'Rate should not exceed the total amount';
  //     });
  //   }

  //   stateObj.paymentDetails = paymentDetail;
  //   this.setState({job: stateObj});

  //   this.calculateRemainingAmount(index,key);
  // }

  validateForm (job) {
    var validForm = true;
    var formError = this.state.formError;
    var jobState = this.state.job;
    var nonValidateFieldsArr = ['estimatedStartDate', 'is_saved', 'step_data', 'current_highest_job_step', 'others', 'showOthers', 'declined_candidates', 'posted_at', 'inProgressStep'];

    for (var key in job) {
      if (nonValidateFieldsArr.indexOf(key) > -1) {
        continue;
      }
      if(Array.isArray(job[key])) {
        if(!job[key].length) {
          formError[key] = true;
          validForm = false;
        }
      } else {
        if(key === 'zipCode') {
          if(job[key]) {
            var text = /^[0-9]+$/;
            if (job[key].length === 5 && text.test(job[key])) {
              this.setState({zipErr: ''})
            } else {
              this.setState({zipErr: constant.INVALID_ZIPCODE});
              formError[key] = true;
              validForm = false;
            }
          } else {
            this.setState({zipErr:constant.ENTER_ZIPCODE});
            formError[key] = true;
            validForm = false;
          }
        } 
        else if (key === 'duration' && !(Number(job[key]))) {
          // if (job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee') {
          if (job.jobType == '1099') {
            formError[key] = false;
            validForm = true;
          } else {
            formError[key] = constant['DURATION_ERROR'];
            validForm = false;
          }
        } 
        // else if (key === 'rate' && !(Number(job[key]))) {
        //   if (job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee') {
        //     formError[key] = false;
        //     validForm = true;
        //   } else {
        //     formError[key] = constant['RATE_ERROR'];
        //     validForm = false;
        //   }
        // } 
        // else if (key === 'hours' && job['rateType'] === 'HOURLY' && !(Number(job[key]))) {
        else if (key === 'hours' && !(Number(job[key]))) {
          if (job.jobType == '1099') {
            formError[key] = false;
            validForm = true;
          } else {
            formError[key] = constant['HOURS_ERROR'];
            validForm = false;
          }
        } 
        // else if (key === 'subTotal' && job['subTotal'] < 100) {
        //   if (job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee') {
        //     formError[key] = false;
        //     validForm = true;
        //   } else {
        //     formError[key] = constant['MIN_JOB_AMOUNT'];
        //     validForm = false;
        //   }
        // }
        else {
          if(!job[key] && typeof(job[key]) != "number") {
            formError[key] = true;
            validForm = false;
          } else {
            formError[key] = false;
          }
        }
      }
    }
    // var paymentDetails = this.state.job.paymentDetails;
    // if (!(job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee')) {
    //   paymentDetails.forEach(function(paymentDetail,index) {
    //     if(!paymentDetail.rate && index == 0){
    //       validForm = false;
    //       paymentDetail.errorMessage = 'Please enter rate';
    //     } else {
    //       if(paymentDetail.errorMessage){
    //         formError[key] = true;
    //         validForm = false;
    //       }
    //     }
    //   });
    // }
    // jobState.paymentDetails = paymentDetails;
    this.setState({formError: formError});
    this.setState({job: jobState});
    return validForm;
  }

  getJobPost(id) {
    let that = this;
    var job = this.state.job;
    utils.apiCall('GET_JOB_DETAIL', { 'params': [id] }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Job Detail');
        utils.logger('error', 'Get Job Detail Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          var data = utils.getDataFromRes(response, 'job_detail');
          job = data;
          job.estimatedStartDate = data.estimatedStartDate || '';
          // if(data.paymentDetails.length == 0){
          //   job.paymentDetails = [{rate: '', delivery: '', dueDate: ''}];
          // }
          // data.paymentDetails.map((payment,index) => {
          //   job.paymentDetails[index].dueDate = payment.dueDate || '';
          // });
          that.setState({
            // legablyChargesForFixed: parseFloat(data.subTotal * job.currentRate/100).toFixed(2),
            job: job,
            // diableHours: (data['rateType'] === utils.ENUM.RATE_TYPE.FIXED) ? 'disabled': false
          }, 
          // function() {
          //   that.calculateRemainingAmount();
          // }
          );
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  clearForm() {
    this.setState({
      job : {
        jobType: this.state.defaultJobType,
        paymentType: this.state.defaultPaymentType,
        jobHeadline:'',
        practiceArea: [],
        skillsNeeded:[],
        jobDescription:'',
        city:'',
        state:'',
        zipCode:'',
        estimatedStartDate:'',
        duration:'',
        durationPeriod: utils.ENUM.DURATION_PERIOD.DAYS,
        rate:'',
        rateType: utils.ENUM.RATE_TYPE.HOURLY,
        hours:'',
        hoursType: this.state.employment_type_dropdown[0]['value'],
        subTotal: '',
        total: '',
        currentRate:'',
        remainingAmount: '',
        paymentDetails: [
          {rate: '', delivery: '', dueDate: ''}
        ],
        setting_id: ''
      },
      legablyChargesForFixed : 0
    });
    window.scrollTo(0, 0);
    // this.getServiceCharge();
  }

  createJob(e, status, callback) {
    e.preventDefault();
    e.stopPropagation();
    var _this = this;
    var job = this.state.job;

    if(!this.validateForm(job)) {
      return;
    }

    job.hours = Number(job.hours);
    // job.rate = Number(job.rate);
    job.duration = Number(job.duration);
    job.zipCode = job.zipCode;
    job.status = status;
    // if (job.jobType == '1099') {
    //   job.paymentDetails = [
    //     {rate: Number(0), delivery: '', dueDate: ''}
    //   ];
    // }
    delete job['current_highest_job_step'];

    utils.apiCall('CREATE_JOB', { 'data': job }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while creating Job');
        utils.logger('error', 'Create Job Error -->', err);
      } else {
        if (response.data.Code == 200 && response.data.Status == true) {
          callback();
        } else {
          utils.flashMsg('show', response.data.Message);
        }
      }
    });
  }

  postOrSaveJob(evt, status) {
    let _this = this;
    let callback = function() {
      let popupType = constant['POPUP_TYPES']['CONFIRM'];
      _this.setState({
        modalPopupObj: {
          type: popupType,
          iconImgUrl: constant['IMG_PATH'] + 'svg-images/positive-alert-icon.svg',
          msg: (status === constant['STATUS']['INACTIVE']) ? constant['POPUP_MSG']['JOB_SAVE_SUCCESS'] : constant['POPUP_MSG']['JOB_POST_SUCCESS'],
          noBtnAction: function() {
            utils.modalPopup(popupType, 'hide', _this);
            utils.changeUrl(constant['ROUTES_PATH']['MY_POSTED_JOBS']);
          },
          yesBtnAction: function() {
            utils.modalPopup(popupType, 'hide', _this);
            _this.clearForm();
          }
        }
      }, function() {
        utils.modalPopup(popupType, 'show', _this);
      });
    }

    _this.createJob(evt, status, callback)
  }

  updateJob(evt, status) {
    let callback = () => {
      helper.openSuccessMessagePopup(this, 'JOB_UPDATE_SUCCESS', () => {
        utils.changeUrl(constant['ROUTES_PATH']['MY_POSTED_JOBS'] + '/' + this.props.jobId);
      });
    }
    this.createJob(evt, status, callback);
  }

  validStartDate(current) {
    return (moment(current.format(constant['DATE_FORMAT'])).isSameOrAfter(utils.getCurrentEstDate()));
  }

  renderDay(props, currentDate, selectedDate) {
    return (<td {...utils.getUpdatedCalenderProps(props, currentDate)}>{ currentDate.date() } </td>);
  }

  render() {
    var job = this.state.job;

    return (
      <div>
        <form>
          <div className="job-posting-card card">
            <div className="row">
              <div className="col-sm-6">
                <div className={this.state.formError.jobType ? 'form-group global-error' : 'form-group' }>
                  <label className="control-label">Job Type*</label>
                  <select name="jobType" className="form-control" value={job.jobType} onChange={(e) => this.changeInput(e, 'jobType')} onBlur={(e) => this.handleOnBlur(e, 'jobType')}>
                    {this.state.job_type_dropdown}
                  </select>
                  {this.state.formError.jobType ? <p><span> Please select job type </span></p> : ''}
                </div>
              </div>
              {/* <div className="col-sm-6">
                <div className={this.state.formError.paymentType ? 'form-group global-error' : 'form-group' }>
                  <label className="control-label">Payment Type*</label>
                  <select name="paymentType" className="form-control" value={job.paymentType} onChange={(e) => this.changeInput(e, 'paymentType')} onBlur={(e) => this.handleOnBlur(e, 'paymentType')}>
                    {this.state.payment_type_dropdown}
                  </select>
                  {this.state.formError.paymentType ? <p><span> Please select payment type </span></p> : ''}
                </div>
              </div> */}
            </div>
            <div className={this.state.formError.jobHeadline ? 'form-group global-error' : 'form-group' }>
              <label className="control-label">job headline*</label>
              <input name="jobHeadline" className="form-control" placeholder="Job Headline" type="text"  maxLength="150" value={job.jobHeadline} onChange={(e) => this.changeInput(e, 'jobHeadline')} onBlur={(e) => this.handleOnBlur(e, 'jobHeadline')}/>
              {this.state.formError.jobHeadline ? <p><span> Please enter job headline </span></p> : ''}
            </div>
            <div className="row">
              <div className={(job.showOthers == 'true' || job.showOthers == true) ? "col-sm-4" : "col-sm-6"}>
                <div className={this.state.formError.practiceArea ? 'form-group global-error' : 'form-group' }>
                  <label className="control-label">PRACTICE AREA(S)*</label>
                  <Select multi closeOnSelect = {false} onBlurResetsInput = {true} autosize = {false}
                    onChange={(val) => this.setMultiSelectValues(val, 'practiceArea')}
                    options={this.state.practice_area_dropdown}
                    placeholder="Select Practice Area(s)"
                    value={job.practiceArea} />
                  {this.state.formError.practiceArea ? <p><span> Please select practice area </span></p> : ''}
                </div>
              </div>
              <div className={(job.showOthers == 'true' || job.showOthers == true) ? "col-sm-4" : "col-sm-6"}>
                <div className={this.state.formError.skillsNeeded ? 'form-group global-error' : 'form-group' }>
                  <label className="control-label">Skills Needed*</label>
                  <Select multi closeOnSelect = {false} onBlurResetsInput = {true}
                  autosize = {false}
                  onChange={(val) => this.logChangeSkills(val, 'skillsNeeded')}
                  options={this.state.skill_dropdown}
                  placeholder="Select Skill(s) Needed"
                  value={job.skillsNeeded} />
                  {this.state.formError.skillsNeeded ? <p><span> Please select skills needed </span></p> : ''}
                </div>
              </div>
              <div className="col-sm-4">
                <div className={(job.showOthers == 'true' || job.showOthers == true)? 'form-group' : 'form-group d-none'}>
                  <label className="control-label">Other</label>
                  <input value={job.others} onBlur={(e) => this.handleOnBlur(e, 'others')} onChange={(e) => this.changeInput(e, 'others')} name="others" className="form-control" placeholder="Other skills needed" type="text" />
                </div>
              </div>
            </div>
            <div className={this.state.formError.jobDescription ? 'form-group global-error' : 'form-group' }>
              <label className="control-label">JOB DESCRIPTION*</label>
              <textarea name="jobDescription" className="form-control" maxLength="2000"  placeholder="Type your description here" value={job.jobDescription} onChange={(e) => this.changeInput(e, 'jobDescription')} onBlur={(e) => this.handleOnBlur(e, 'jobDescription')}></textarea>
              {this.state.formError.jobDescription ? <p><span> Please enter job description </span></p> : ''}
            </div>
            <div className="row">
              <div className="col-sm-4">
                <div className={this.state.formError.city ? 'form-group global-error' : 'form-group' }>
                  <label className="control-label">City*</label>
                  <input name="city" className="form-control" placeholder="City" type="text" value={job.city} onChange={(e) => this.changeInput(e, 'city')} onBlur={(e) => this.handleOnBlur(e, 'city')}/>
                  {this.state.formError.city ? <p><span> {constant['ENTER_CITY']} </span></p> : ''}
                </div>
              </div>
              <div className="col-sm-4">
                <div className={this.state.formError.state ? 'form-group global-error' : 'form-group' }>
                  <label className="control-label">State*</label>
                  <select name="state" className="form-control" value={job.state} onChange={(e) => this.changeInput(e, 'state')} onBlur={(e) => this.handleOnBlur(e, 'state')}>
                    <option value="">Select state</option>
                    {this.state.state_dropdown}
                  </select>
                  {this.state.formError.state ? <p><span> Please select state </span></p> : ''}
                </div>
              </div>
              <div className="col-sm-4">
                <div className={this.state.formError.zipCode ? 'form-group global-error' : 'form-group' }>
                  <label className="control-label">Zip Code*</label>
                  <input name="zipCode" className="form-control" placeholder="Zip Code" type="text" value={job.zipCode} onChange={(e) => this.validateLength(e, 'zipCode', 99999)} onBlur={(e) => this.handleOnBlur(e, 'zipCode')}/>
                  {this.state.formError.zipCode ? <p><span> {this.state.zipErr} </span></p> : ''}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className={this.state.formError.setting_id ? 'form-group global-error' : 'form-group' }>
                  <label className="control-label">Location*</label>
                  <select name="setting_id" className="form-control" value={job.setting_id} onChange={(e) => this.changeInput(e, 'setting_id')} onBlur={(e) => this.handleOnBlur(e, 'setting_id')}>
                    <option value="">Select Location</option>
                    {this.state.work_location_dropdown}
                  </select>
                  {this.state.formError.setting_id ? <p><span> Please select location </span></p> : ''}
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <label className="control-label">Estimated Start date</label>
                  <Datetime onChange={(date) => this.handleStartDateChange(date)}
                    onBlur={(e) => utils.onCalendarBlur(e)}
                    value={job.estimatedStartDate}
                    input={true}
                    inputProps={{placeholder: 'ASAP', name: 'searchStartDate', readOnly: true}}
                    name='start_date'
                    closeOnSelect={true}
                    dateFormat={constant['DATE_FORMAT']}
                    timeFormat={false}
                    isValidDate={ this.validStartDate }
                    renderDay={ this.renderDay }
                    className={ 'date-time' }
                  />
                  { job.estimatedStartDate ?
                      <span className="clear" onClick={(e) => this.handleStartDateChange('')}></span>
                    :
                      null
                  }
                </div>
              </div>
            </div>
            {/* {!(job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee') && */}
            {job.jobType != '1099' &&
              <div className="posting-two-cols">
                <div className='form-group'>
                  <label className="control-label">ESTIMATED DURATION OF ENGAGEMENT*</label>
                  <div className={this.state.formError.duration ? 'global-error inline-to-block' : 'inline-to-block' }>
                    <input name="duration" className="form-control custom-num" placeholder="00" type="text" value={job.duration} onChange={(e) => this.validateLength(e, 'duration', 999)} onBlur={(e) => this.handleOnBlur(e, 'duration')}/>
                    {this.state.formError.duration ? <p><span> {this.state.formError.duration} </span></p> : ''}
                  </div>
                  <ul className="tabbed-radio-btns three-tabs">
                    <li>
                      <input type="radio" name="d-w-m" checked={job.durationPeriod == utils.ENUM.DURATION_PERIOD.DAYS ? 1 : 0} value={utils.ENUM.DURATION_PERIOD.DAYS} onClick={(e) => this.changeInput(e, 'durationPeriod')}/>
                        <span>Days</span>
                    </li>
                    <li>
                      <input type="radio" name="d-w-m" value={utils.ENUM.DURATION_PERIOD.WEEKS} checked={job.durationPeriod == utils.ENUM.DURATION_PERIOD.WEEKS ? 1 : 0}  onClick={(e) => this.changeInput(e, 'durationPeriod')}/>
                        <span>Weeks</span>
                    </li>
                    <li>
                      <input type="radio" name="d-w-m" value={utils.ENUM.DURATION_PERIOD.MONTHS} checked={job.durationPeriod == utils.ENUM.DURATION_PERIOD.MONTHS ? 1 : 0}  onClick={(e) => this.changeInput(e, 'durationPeriod')}/>
                        <span>Months</span>
                    </li>
                  </ul>
                </div>
              </div>
            }
            <div className="posting-two-cols">
              {/* <div className='form-group'>
                <label className="control-label">TARGET RATE*</label>
                <div className={this.state.formError.rate ? 'global-error inline-to-block' : 'inline-to-block' }>
                <input className="form-control amount-dollar-bg text-left custom-num" placeholder="Rate" type="text" value={job.rate} onChange={(e) => this.validateAndCalculateAmount(e, 'rate', 999999)} onBlur={(e) => this.handleOnBlur(e, 'rate')}/>
                {this.state.formError.rate ? <p><span> {this.state.formError.rate} </span></p> : ''}
              </div>
              <ul className="tabbed-radio-btns">
                <li>
                  <input type="radio" name="h-f" checked={job.rateType == utils.ENUM.RATE_TYPE.HOURLY ? 1 : 0} value={utils.ENUM.RATE_TYPE.HOURLY} onClick={(e) => this.onChangeHoursType(e, 'rateType')}/>
                  <span>Hourly</span>
                </li>
                <li>
                  <input type="radio" name="h-f" checked={job.rateType == utils.ENUM.RATE_TYPE.FIXED ? 1 : 0} value={utils.ENUM.RATE_TYPE.FIXED} onClick={(e) => this.onChangeHoursType(e, 'rateType')}/>
                  <span>Fixed</span>
                </li>
              </ul>
            </div> */}
            </div>
           {/* {!(job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee') && */}
           {job.jobType != '1099' &&
              <div className="posting-two-cols hours-col">
                <div className='form-group'>
                  <label className="control-label">ESTIMATED HOURS OF WORK REQUIRED*</label>
                  <div className={this.state.formError.hours && job.rateType != utils.ENUM.RATE_TYPE.FIXED ? 'global-error inline-to-block' : 'inline-to-block' }>
                    <input className="form-control custom-num" placeholder="00" type="text" value={job.hours} onChange={(e) => this.validateAndCalculateAmount(e, 'hours', 999)} onBlur={(e) => this.handleOnBlur(e, 'hours')} disabled={this.state.diableHours}/>
                    {this.state.formError.hours ? <p><span> {this.state.formError.hours} </span></p> : ''}
                  </div>
                  <div className="pt-ft-w-m">
                    <ul className="tabbed-radio-btns">
                      {this.state.employment_type_dropdown.map((hoursType, index) =>
                        <li key={index}>
                          <input type="radio" name="pt-ft" checked={hoursType.value == job.hoursType ? 1 : 0} value={hoursType.value} onClick={(e) => this.changeInput(e, 'hoursType')} disabled={this.state.diableHours}/>
                          <span>{hoursType.label}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            }
            <div className="separator"></div>
            {/* <div className="estimated-section">
              {!(job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee') &&
              <div className="estimated-amount-section">
                <h5>Estimated Amount Payable to Selected Candidate</h5>
                <p>Based on the information you have provided, the estimated amount payable to your selected candidate is indicated below.</p>
                <div className="row">
                  <div className="col-sm-4">
                    <div className={this.state.formError.subTotal ? 'form-group global-error' : 'form-group'}>
                      <label className="control-label">AMOUNT PAYABLE</label>
                      <input className="form-control amount-dollar-bg" placeholder="Total" type="text" value={job.subTotal} disabled="true"/>
                      {this.state.formError.subTotal ? <p><span> {this.state.formError.subTotal} </span></p> : ''}
                    </div>
                  </div>
                </div>
                <div className="separator"></div>
              </div>
              }
              {!(job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee') &&
              <div className="estimated-schedule-section">
                <h5>Estimated Payment and Deliverable Schedule</h5>
                <p>The estimated payment and deliverable schedule allows you to disperse the estimated amount payable to your selected candidate over the course of your project or task based upon the completion of specific deliverables. If there is only one deliverable, simply allocate the estimated amount payable to your selected candidate to that single item. </p>
                <ul className="hidden-xs row mb-0">
                  <li className="col-sm-4">
                    <label className="control-label">Amount Payable*</label>
                  </li>
                  <li className="col-sm-4">
                    <label className="control-label">On Delivery Of</label>
                  </li>
                  <li className="col-sm-4">
                    <label className="control-label">Due Date</label>
                  </li>
                </ul>
                {job.paymentDetails.map((paymentDetail, index) =>
                  <ul className="payment-details row" key={index}>
                    <li className={paymentDetail.errorMessage ? 'global-error col-sm-4' : 'col-sm-4' }>
                      <span className="hidden visible-xs">Amount Payable*</span>
                      <input className="amount-dollar-bg custom-num" type="text" placeholder="Payment" value={paymentDetail.rate} onChange={(e) => this.setPaymentDetails(e, 'rate', index)}/>
                      <p className="static"><span>{paymentDetail.errorMessage || ''}</span></p>
                    </li>
                    <li className="col-sm-4">
                      <span className="hidden visible-xs">On Delivery Of</span>
                      <input type="text" className="form-control" placeholder="Deliverable Description" value={paymentDetail.delivery} onChange={(e) => this.setPaymentDetails(e, 'delivery', index)}/>
                    </li>
                    <li className='col-sm-4'>
                      <span className="hidden visible-xs">Due Date</span>
                      <Datetime onChange={(date) => this.handleDueDate(date, index)}
                        onBlur={(e) => utils.onCalendarBlur(e)}
                        value={paymentDetail.dueDate}
                        input={true}
                        inputProps={{placeholder: 'Due Date', name: 'searchStartDate', readOnly: true}}
                        name='start_date'
                        closeOnSelect={true}
                        dateFormat={constant['DATE_FORMAT']}
                        timeFormat={false}
                        isValidDate={ this.validStartDate }
                        renderDay={ this.renderDay }
                        className={ 'date-time' }
                      />
                      { paymentDetail.dueDate ?
                          <span  className="clear" onClick={(e) => this.handleDueDate('', index)}></span>
                        :
                          null
                      }
                    </li>
                    { (job.paymentDetails.length > 0  && index!=0) ?
                      <p className="less" onClick={(e) => this.removePaymentDetail(index)}>
                        <i className="fa fa-minus-circle"></i>
                        <span>Delete</span>
                      </p> :
                      <p></p>
                    }
                    { (job.paymentDetails.length > 0 && index == job.paymentDetails.length-1 && job.remainingAmount != 0) ?
                      <p className="add-more" onClick={(e) => this.addPaymentDetail()}>
                        <i className="fa fa-plus-circle"></i>
                        <span>Add More</span>
                      </p> :
                      <p></p>
                    }
                  </ul>
                )}
                <ul className="remaining-detail">
                  <li>
                    <label className="control-label">REMAINDER TO BE ALLOCATED </label>
                    <span className="hidden visible-xs">Rate</span>
                    <input type="text" className="form-control amount-dollar-bg" placeholder="Remaining" value={job.remainingAmount} disabled="true"/>
                  </li>
                </ul>
                <div className="separator"></div>
              </div>
              }
              <div className="estimated-total-cost-section">
                {!(job.jobType == '1099' && job.paymentType == 'Hourly Rate/Fixed Fee') ? (
                  <div className="estimated-total-cost">
                    <h5>Estimated Total Cost</h5>
                    <p>The estimated total cost of this engagement is indicated below. Please note that this amount is subject to change pending final agreed upon terms negotiated between you and the candidate. Once you have agreed to terms with your candidate and are ready to move forward, the actual total cost will be due and placed in escrow, payable to your candidate per the final agreed upon payment and deliverable schedule.</p>
                    <p>
                      <span className="pull-left">Estimated amount payable to selected candidate:</span>
                      <span className="pull-right">{isNaN((parseFloat(job.subTotal)).toFixed(2))? "$00.00" : '$'+job.subTotal}</span>
                      <span className="clearfix"></span>
                    </p>
                    <p>
                      <span className="pull-left">Estimated Legably service charge:</span>
                      <span className="pull-right">{ isNaN((parseFloat(this.state.legablyChargesForFixed)).toFixed(2)) ? '$0.00' : '$'+this.state.legablyChargesForFixed}</span>
                      <span className="clearfix"></span>
                    </p>
                    <p className="clearfix grand-total">
                      <span className="pull-left">Estimated total cost</span>
                      <span className="pull-right">{isNaN((parseFloat(job.total)).toFixed(2)) ? '$00.00' : '$'+parseFloat(job.total).toFixed(2)}</span>
                      <span className="clearfix"></span>
                    </p>
                  </div>
                  ) : (
                    <p>By posting this job you agree to pay an attorney for the work outlined above based either on the hourly rate or the fixed fee that the you both agree to on the Negotiated Terms screen. You also agree to pay the Legably service charge at the same time of payment to the attorney completing the work.</p>
                  )
                }
              </div>
            </div> */}
          </div>
          {
            this.props.isEditJobPage ?
              <div className="nxt-prev-btns">
                <button type="submit" name="updateJob" className="d-block btn-primary btn pull-right ml-10" onClick={(e) => this.updateJob(e, job.status)}>Update Job</button>
                <span className="clear-fix"></span>
              </div>
            :
              <div className="nxt-prev-btns">
                <button type="submit" name="postJob" className="d-block btn-primary btn pull-right ml-10" onClick={(e) => this.postOrSaveJob(e, constant['STATUS']['ACTIVE'])}>Post Job</button>
                <button type="submit" name="saveJob" className="d-block btn-primary btn pull-right" onClick={(e) => this.postOrSaveJob(e, constant['STATUS']['INACTIVE'])}>Save Job</button>
                <span className="clear-fix"></span>
              </div>
          }
        </form>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div>
    );
  }
}
