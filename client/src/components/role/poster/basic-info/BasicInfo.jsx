import React from 'react';
import Select from 'react-select';

import { Role, Mask } from '../../../index';
import { constant, utils, cookieManager } from '../../../../shared/index';

export default class PosterBasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options : [],
      formObj:{ 'job_posters_info':{'basic_profile':{'basic_info': {}}}},
      formErrors: {
        first_name: '',
        last_name: '',
        street_address: '',
        city: '',
        state_id: '',
        zipcode: '',
        phone_number: '',
        firm_name : '',
        website_url: '',
        bar_admission: [
          {
            bar_state_id: '',
            bar_registration_number: ''
          }
        ],
      },
      formVal:{
        first_name: '',
        last_name: '',
        street_address: '',
        city: '',
        state_id: '',
        zipcode: '',
        phone_number: '',
        firm_name : '',
        title: '',
        website_url: '',
        practice_location_id: [],
        practice_area_id: [],
        intrested_in_id: [],
        bar_admission: [
          {
            bar_state_id: '',
            bar_registration_number: ''
          }
        ],
      },
      completeStatus : '',
      practice_location_dropdown:[],
      formValid:false,
      practice_area_dropdown:[],
      category_dropdown:[],
      basState_coll:[],
      counter:[],
      countArr:[],
      token : '',
      editProfile : false,
      profileComplete : false,
      firstName : '',
      lastName : ''
    };
    this.handleInfoSubmit = this.handleInfoSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.getMaskedVal = this.getMaskedVal.bind(this);
    this.logChange = this.logChange.bind(this);
    this.handleUserBarAdInput = this.handleUserBarAdInput.bind(this);
    this.createBarAdmissionContainer = this.createBarAdmissionContainer.bind(this);
  }

  getAllDropdownsData() {
    let that = this;
    let states = [];
    let stateLocations = [];
    let practiceAreas = [];
    let categories = [];

    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);

          for (let statesObj of data['states']) {
            states.push(<option key={statesObj['_id']} value={statesObj['_id']}>{statesObj['name']}</option>);
            stateLocations.push({value: statesObj['_id'], label: statesObj['name']});
          }
          that.setState({state_dropdown: states});
          that.setState({practice_location_dropdown: stateLocations});

          for (let pAreasObj of data['practice_areas']) {
            practiceAreas.push({value: pAreasObj['_id'], label: pAreasObj['name']});
          }
          that.setState({practice_area_dropdown: practiceAreas});

          for (let categoriesObj of data['categories']) {
            categories.push({value: categoriesObj['_id'], label: categoriesObj['name']});
          }
          that.setState({category_dropdown: categories});
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  logChange(val,k) {
    let list = [];
    for(var key in val){
      list.push(val[key].value);
    }

    var formVal = Object.assign({},this.state.formVal);
    if(k == 'intrested_in_id'){
      formVal.intrested_in_id = list;
    }
    else if(k == 'practice_area_id'){
      formVal.practice_area_id = list;
    }
    else if(k == 'practice_location_id'){
      formVal.practice_location_id = list;
    }

    this.setState({formVal},function(){
    });
  }

  handleUserInput(e){
    let formVal = Object.assign({}, this.state.formVal);
    formVal[e.target.name] = e.target.value;

    this.setState({formVal});

    if(e.target.name == 'state_id'){
      this.validateField(e.target.name, e.target.value);
    }

    else if(e.target.name == 'phone_number'){
     var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
     e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

     formVal[e.target.name] = e.target.value;
     this.setState({formVal});
    }
  }

  handleUserBarAdInput(i,e) {
    let formVal = Object.assign({}, this.state.formVal);

    formVal.bar_admission[i][e.target.name] = e.target.value;
    this.setState({formVal});
  }

    componentDidMount() {
      this.getAllDropdownsData();
      let thisObj = this;

      this.setState({token:utils.getToken()},function(){
        this.getUserProfile(false);
      });
    }

    getMaskedVal(evt, maskedPhoneNo) {
      let formVal = Object.assign({}, this.state.formVal);
      formVal.phone_number = maskedPhoneNo;
      this.setState({formVal});
    }

    handleInfoSubmit(e){
      e.preventDefault();
      let obj = [];
      let formVal = Object.assign({}, this.state.formVal);
      window.scrollTo(0, 0);

      let fieldValidationErrors = this.state.formErrors;
      let callFrom = e.target.name;
      switch('street_address') {

          case 'street_address':
            if(!this.state.formVal.street_address){
              fieldValidationErrors.street_address = constant.ENTER_STREET_ADD;
            }
            else{
              fieldValidationErrors.street_address = '';
            }

            case 'first_name':
              if(this.state.formVal.first_name){
                fieldValidationErrors.first_name = '';
                fieldValidationErrors.last_name = this.state.formVal.first_name.match(/^[a-zA-Z \-]+$/) ? '' : constant.INVALID_FIRSTNAME;
              }
              else{
                fieldValidationErrors.first_name = constant.ENTER_FIRST_NAME;
              }

            case 'last_name':
              if(this.state.formVal.last_name){
                 fieldValidationErrors.last_name = '';
                 fieldValidationErrors.last_name = this.state.formVal.last_name.match(/^[a-zA-Z \-]+$/) ? '' : constant.INVALID_LASTNAME;
              }
              else{
                 fieldValidationErrors.last_name = constant.ENTER_LAST_NAME;
              }

            case 'city':
              if(this.state.formVal.city){
                fieldValidationErrors.city = '';
                fieldValidationErrors.city = this.state.formVal.city.match(/^[a-zA-Z ]+$/) ? '' : constant.INVALID_CITY_NAME;

              }else{

                fieldValidationErrors.city = constant.ENTER_CITY;
              }

            case 'state_id':

              if(!this.state.formVal.state_id){

                fieldValidationErrors.state_id = constant.ENTER_STATE;
              }else{

                fieldValidationErrors.state_id = '';
              }

            case 'zipcode':
              if(!this.state.formVal.zipcode){

                fieldValidationErrors.zipcode = constant.ENTER_ZIPCODE;
              }
              else{
                if(!fieldValidationErrors.zipcode){
                fieldValidationErrors.zipcode = '';
               }
              }

            case 'phone_number':
              if(this.state.formVal.phone_number){
                fieldValidationErrors.phone_number = '';
                if (this.state.formVal.phone_number.length <= 11) {
                  formVal.phone_number = this.state.formVal.phone_number;
                  this.setState({formVal});
                  fieldValidationErrors.phone_number = constant.INVALID_PHONE_NO;
                } else {
                  fieldValidationErrors.phone_number ='';
                }
              } else {
                fieldValidationErrors.phone_number = constant.ENTER_PHONE_NO;
              }

              case 'website_url':
                if(this.state.formVal.website_url){
                 fieldValidationErrors.website_url = formVal.website_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? '' : constant.INVALID_URL;;
                }
                else{
                  if(fieldValidationErrors.website_url){
                  fieldValidationErrors.website_url = '';
                 }
                }
                
              case 'firm_name':
                if (this.state.formVal.firm_name){
                  fieldValidationErrors.firm_name = '';
                } else{
                  fieldValidationErrors.firm_name = constant.ENTER_FIRM_NAME;
                }

              case 'bar_state_id':
                for(var i=0; i < (this.state.formVal.bar_admission).length; i++) {
                  if(!this.state.formVal.bar_admission[i].bar_state_id) {
                    fieldValidationErrors.bar_admission[i].bar_state_id = constant.ENTER_STATE;
                  } else {
                    fieldValidationErrors.bar_admission[i].bar_state_id = '';
                  }
                }

              case 'bar_registration_number':
                for(var i=0; i < (this.state.formVal.bar_admission).length; i++) {
                  if(!this.state.formVal.bar_admission[i].bar_registration_number) {
                    fieldValidationErrors.bar_admission[i].bar_registration_number = constant.ENTER_BAR_NO;
                  } else{
                    if(!fieldValidationErrors.bar_admission[i].bar_registration_number)
                      fieldValidationErrors.bar_admission[i].bar_registration_number = '';
                  }
                }

            default:
              break;
          }

        var _this = this;

        this.setState({formErrors: fieldValidationErrors});

        let formObj = this.state.formObj;
        formObj.first_name = formVal.first_name;
        formObj.last_name = formVal.last_name;
        formObj.job_posters_info.basic_profile.basic_info.street_address = formVal.street_address;
        formObj.job_posters_info.basic_profile.basic_info.city = formVal.city;
        formObj.job_posters_info.basic_profile.basic_info.state_id = formVal.state_id;
        formObj.job_posters_info.basic_profile.basic_info.zipcode = formVal.zipcode;
        formObj.job_posters_info.basic_profile.basic_info.phone_number = formVal.phone_number;

        formObj.job_posters_info.basic_profile.practice_area_id = formVal.practice_area_id;
        formObj.job_posters_info.basic_profile.firm_name = formVal.firm_name;
        formObj.job_posters_info.basic_profile.title = formVal.title;
        formObj.job_posters_info.basic_profile.practice_location_id = formVal.practice_location_id;
        formObj.job_posters_info.basic_profile.intrested_in_id = formVal.intrested_in_id;
        formObj.job_posters_info.basic_profile.website_url = formVal.website_url;

        formObj.job_posters_info.basic_profile.bar_admission = formVal.bar_admission;

        this.setState({formObj:formObj},function() {
          if(this.validateForm()) {
            utils.apiCall('SET_POSTER_BASIC_PROFILE', { 'data': this.state.formObj }, function(err, response) {
              if (err) {
                utils.flashMsg('show', 'Error while setting Poster Basic Profile');
                utils.logger('error', 'Set Poster Basic Profile Error -->', err);
              } else {
                if (response.data.Code == 200 && response.data.Status == true) {
                  let userData = utils.getCurrentUser();
                  if (userData) {
                    userData.first_name = formVal.first_name;
                    userData.last_name = formVal.last_name;
                    userData.is_poster_profile_completed = true;
                    cookieManager.setObject('currentUser', userData);
                    _this.props.forceUpdateHeader();
                 }
                  if(callFrom == "save") {
                    utils.flashMsg('show', constant.SUCCESS_UPDATE_PROFILE, 'success');
                    _this.getUserProfile(true);
                  } else {
                    utils.changeUrl(constant['ROUTES_PATH']['POSTER_THANK_YOU']);
                  }
                } else {
                  utils.flashMsg('show', response.data.Message);
                }
              }
            });
          }
        });
    }

    handleInputOnBlur(e,index){
      let fieldValidationErrors;

      fieldValidationErrors = this.state.formErrors;
      this.setState({[e.target.name]: e.target.value});
      this.setState({formErrors: fieldValidationErrors});
      this.validateField(e.target.name, e.target.value,index);
    }

    limit(len,e){
      let flag = false;
       if (e.target.value.trim().length >= len){
        if(flag){
          if(e.target.value.trim().length == len){
            flag = false;
          }
        }else{
          if(e.ctrlKey && e.keyCode == 65){
            flag = true;
          }

          else if(!(e.ctrlKey && e.keyCode ==67) && !(e.ctrlKey && e.keyCode ==88) && !(e.ctrlKey && e.keyCode ==65 )&& e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 46 && e.keyCode !== 9 && e.keyCode !== 17  && (e.keyCode >= 96 || e.keyCode <=105)){
            e.preventDefault();
          }

        }
      }
    }

    validateField(fieldName, value,index) {
      let fieldValidationErrors = this.state.formErrors;

      switch(fieldName) {
        case 'first_name':
          if(value){
            fieldValidationErrors.first_name = '';
            fieldValidationErrors.first_name = value.match(/^[a-zA-Z \-]+$/) ? '' : constant.INVALID_FIRSTNAME;
          }
          else{
           fieldValidationErrors.first_name = constant.ENTER_FIRST_NAME;
          }
        break;
        case 'last_name':
          if(value){
            fieldValidationErrors.last_name = '';
            fieldValidationErrors.last_name = value.match(/^[a-zA-Z \-]+$/) ? '' : constant.INVALID_LASTNAME;
          }
          else{
            fieldValidationErrors.last_name = constant.ENTER_LAST_NAME;
          }
        break;
        case 'street_address':
          if(!value){
            fieldValidationErrors.street_address = constant.ENTER_STREET_ADD;
          }
          else{
            fieldValidationErrors.street_address = '';
          }
        break;
        case 'city':
          if(value){
            fieldValidationErrors.city = '';
            fieldValidationErrors.city = value.match(/^[a-zA-Z ]+$/) ? '' : constant.INVALID_CITY_NAME;

          }else{

            fieldValidationErrors.city = constant.ENTER_CITY;
          }
        break;
        case 'state_id':

          if(!value){

            fieldValidationErrors.state_id = constant.ENTER_STATE;
          }else{

            fieldValidationErrors.state_id = '';
          }
        break;
        case 'zipcode':
          if(!value){

            fieldValidationErrors.zipcode = constant.ENTER_ZIPCODE;
          }
          else{
             var text = /^[0-9]+$/;
             if(value.length == 5){
              if (!text.test(value)) {
                 fieldValidationErrors.zipcode = constant.INVALID_ZIPCODE;

               }
               else{
                fieldValidationErrors.zipcode ="";
                }
             }
             else{

               fieldValidationErrors.zipcode = constant.INVALID_ZIPCODE;

             }

          }
        break;
        case 'phone_number':
          if(value){
            fieldValidationErrors.phone_number = '';

            if((value.length <= 11)){
            /*var x = value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
            value = '(' + x[1] + ') ' + x[2] + '-' + x[3]; */
            let formVal = Object.assign({}, this.state.formVal);
            formVal.phone_number = value;
            this.setState({formVal});
            fieldValidationErrors.phone_number = constant.INVALID_PHONE_NO;
          }
          else{
            fieldValidationErrors.phone_number ='';
          }
          }
         else{

            fieldValidationErrors.phone_number = constant.ENTER_PHONE_NO;
          }
          break;
          case 'website_url':
             if(this.state.formVal.website_url){
              fieldValidationErrors.website_url = this.state.formVal.website_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? '' : constant.INVALID_URL;;
             }
             else{
               if(fieldValidationErrors.website_url){
               fieldValidationErrors.website_url = '';
              }
             }
          break;

          case 'firm_name':
            if(!value) {
              fieldValidationErrors.firm_name = constant.ENTER_FIRM_NAME;
            } else{
              fieldValidationErrors.firm_name = '';
            }
            break;

        case 'bar_registration_number':
          if(!value) {
            fieldValidationErrors.bar_admission[index].bar_registration_number = constant.ENTER_BAR_NO;
          } else {
            var text = /^[a-zA-Z0-9]+$/;
            if(value.length <= 15) {
            if(!text.test(value)) {
                fieldValidationErrors.bar_admission[index].bar_registration_number  = constant.ONLY_NUMERIC_ERROR;
              } else {
                  fieldValidationErrors.bar_admission[index].bar_registration_number = '';
              }
            } else {
              fieldValidationErrors.bar_admission[index].bar_registration_number = constant.INVALID_BAR_LENGTH;
            }
        }
        break;

        case 'bar_state_id':
          if(!this.state.formVal.bar_admission[index].bar_state_id) {
            fieldValidationErrors.bar_admission[index].bar_state_id = constant.ENTER_STATE;
          } else {
            fieldValidationErrors.bar_admission[index].bar_state_id = '';
          }
          break;

        default:
          break;
      }
   }
   validateForm() {
    let flag = true;
      for(var key in this.state.formErrors){
        if (key == 'bar_admission') {
          for (var j in this.state.formErrors.bar_admission){
            for (var k in this.state.formErrors.bar_admission[j]){
              if (this.state.formErrors.bar_admission[j][k]){
                flag = false;
                return flag;
              }
            }
          }
        } else {
          if(this.state.formErrors[key]){
            flag = false;
            return flag;
          }
        }
      }
      return flag;
   }

  deleteBar(index) {
    var formVal = this.state.formVal;
    var formErrors = this.state.formErrors;
    formVal.bar_admission.splice(index,1);
    formErrors.bar_admission.splice(index,1);
    this.setState({formVal});
    this.setState({formErrors});
  }

   getUserProfile(isForceUpdateHeader){

    let that = this;
    utils.apiCall('GET_USER_PROFILE', { 'params': ['job_posters_info', 'job_seeker_info'] }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting User Profile');
        utils.logger('error', 'Get User Profile Error -->', err);
      } else {
        if(response.data.Code == 200 && response.data.Status == true){
          let formErrors = Object.assign({},that.state.formErrors);
          let formVal = Object.assign({}, that.state.formVal);
          let basicProfile = response.data.Data.job_posters_info.basic_profile;
          let basicInfo = response.data.Data.job_posters_info.basic_profile.basic_info;

          formVal.first_name = response.data.Data.first_name ?  response.data.Data.first_name : '' ;
          formVal.last_name = response.data.Data.last_name ? response.data.Data.last_name : '';

          formVal.street_address = basicInfo.street_address ? basicInfo.street_address : '';
          formVal.city = basicInfo.city ? basicInfo.city : '';
          formVal.state_id = basicInfo.state_id ? basicInfo.state_id : '';
          formVal.zipcode = basicInfo.zipcode ? basicInfo.zipcode : '';
          formVal.phone_number = basicInfo.phone_number ? basicInfo.phone_number : '';
          formVal.firm_name = basicProfile.firm_name ? basicProfile.firm_name : '';
          formVal.title = basicProfile.title ? basicProfile.title : '';
          formVal.practice_location_id = basicProfile.practice_location_id ? basicProfile.practice_location_id : '';
          formVal.practice_area_id = basicProfile.practice_area_id ? basicProfile.practice_area_id : '';
          formVal.intrested_in_id = basicProfile.intrested_in_id ? basicProfile.intrested_in_id : '';
          formVal.website_url = basicProfile.website_url ? basicProfile.website_url : '';

          var userData = utils.getCurrentUser();
          if(userData){
            userData.first_name = response.data.Data.first_name;
            userData.last_name = response.data.Data.last_name;
            that.setState({firstName : response.data.Data.first_name, lastName : response.data.Data.last_name});
            cookieManager.setObject('currentUser', userData);
          }
           if(response.data.Data.job_posters_info.is_profile_completed == 'Y'){
              that.setState({editProfile : true, profileComplete : true});
            }else{
              that.setState({editProfile : false, profileComplete : false});
            }

          that.setState({completeStatus : response.data.Data.job_posters_info.last_visited_page});

          if(basicProfile.bar_admission.length > 0) {
            formVal.bar_admission = basicProfile.bar_admission;
          }

          for(var i=0;i<(basicProfile.bar_admission.length-1);i++) {
            formErrors.bar_admission.push({
              bar_state_id: '',
              bar_registration_number: ''
            });
          }

          that.setState({formErrors});
          that.setState({formVal});

          if(isForceUpdateHeader) {
            that.props.forceUpdateHeader();
          }
        } else {
          utils.flashMsg('show', response.data.Message);
        }
      }
    })
   }

  createBarAdmissionContainer() {
    var formVal = this.state.formVal;
    var formErrors = this.state.formErrors;

    formVal.bar_admission.push({
      bar_state_id: '',
      bar_registration_number: ''
    });
    formErrors.bar_admission.push({
      bar_state_id: '',
      bar_registration_number: ''
    })
    this.setState({formVal});
    this.setState({formErrors});
  }

  handleChange(e){
    this.setState({selectedOrganization:e.target.value});
    Session.set('currentOrganizationId',e.target.value);
  }

  render() {

    return (
      <Role step="basic_info" role="poster" profileStatus={this.state.completeStatus}>
        <div className="visible-xs mobile-page-heading">Basic Information<span onClick={() => utils.changeUrl(constant['ROUTES_PATH']['POSTER_THANK_YOU'])} className={this.state.completeStatus >= 1 ? 'next' : 'next disabled-element'}></span> </div>
        <form onSubmit={this.handleInfoSubmit}>
          <div className="basic-info-form">

            <div className="basic-info-card card">
              <h4 style={{ marginBottom: 15 }}>Account Information</h4>
              <p style={{ textAlign: 'left', marginBottom: 20 }}>This information is required to create an account.</p>

              <div className="row">
                <div className="col-sm-6">

                  <div className={this.state.formErrors.first_name !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="fname" className="control-label">first name*</label>
                    <input onChange={this.handleUserInput} onBlur={this.handleInputOnBlur} type="text" name="first_name" value={this.state.formVal.first_name} id="fname" className="form-control" placeholder="First Name" />
                    <p><span>{this.state.formErrors.first_name !== '' ? this.state.formErrors.first_name : ''}</span></p>

                  </div>
                </div>
                <div className="col-sm-6">

                  <div className={this.state.formErrors.last_name !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="lname" className="control-label">Last Name*</label>
                    <input onChange={this.handleUserInput} name="last_name" onBlur={this.handleInputOnBlur} type="text" value={this.state.formVal.last_name} id="lname" className="form-control" placeholder="Last Name" />
                    <p><span>{this.state.formErrors.last_name !== '' ? this.state.formErrors.last_name : ''}</span></p>

                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">

                  <div className={this.state.formErrors.street_address !== '' ? 'form-group global-error' : 'form-group'}>
                    <label className="control-label">street address*</label>
                    <textarea onBlur={this.handleInputOnBlur} name="street_address" value={this.state.formVal.street_address} onChange={this.handleUserInput} className="form-control" placeholder="Street Address"></textarea>
                    <p><span>{this.state.formErrors.street_address !== '' ? this.state.formErrors.street_address: ''}</span></p>

                  </div>
                </div>

              </div>

              <div className="row">
                <div className="col-sm-6">

                  <div className={this.state.formErrors.city !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="city" className="control-label">City*</label>
                    <input onBlur={this.handleInputOnBlur} type="text" name="city" value={this.state.formVal.city} id="city" onChange={this.handleUserInput} className="form-control" placeholder="City"/>
                    <p><span>{this.state.formErrors.city !== '' ? this.state.formErrors.city : ''}</span></p>

                  </div>
                </div>
                <div className="col-sm-6">

                  <div className={this.state.formErrors.state_id !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="" className="control-label">State*</label>
                    <div className="select-wrapper">
                      <select onBlur={this.handleInputOnBlur} className="select-simple" name="state_id" value={this.state.formVal.state_id} onChange={this.handleUserInput} className="form-control pmd-select2">
                        <option value="">Select State</option>
                        {this.state.state_dropdown}
                      </select>
                    </div>
                    <p><span>{this.state.formErrors.state_id !== '' ? this.state.formErrors.state_id : ''}</span></p>

                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">

                  <div className={this.state.formErrors.zipcode !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="zipcode" className="control-label">zip Code*</label>
                    <input onBlur={this.handleInputOnBlur} type="text" name="zipcode" value={this.state.formVal.zipcode} id="zipcode" onChange={this.handleUserInput} className="form-control" placeholder="Zip Code"/>
                    <p><span>{this.state.formErrors.zipcode !== '' ? this.state.formErrors.zipcode : ''}</span></p>

                  </div>
                </div>
                <div className="col-sm-6">
                <div className={this.state.formErrors.phone_number !== '' ? 'form-group global-error' : 'form-group'}>

                  <label htmlFor="phone_number" className="control-label">Phone Number*</label>

                  <Mask dataValue={this.state.formVal.phone_number} isReverse={false} mask={"000-000-0000"} nameValue="phone_number" placeholderValue="Phone Number" onMaskBlur={this.handleInputOnBlur} onMaskChange={this.getMaskedVal} />
                  <p><span>{this.state.formErrors.phone_number !== '' ? this.state.formErrors.phone_number : ''}</span></p>
                 </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className='form-group'>
                    <label className="control-label">Practice Location(s)</label>
                    <Select
                      multi
                      closeOnSelect = {false}
                      onBlurResetsInput = {true}
                      autosize = {false}
                      onChange={(value) => this.logChange(value,'practice_location_id')}
                      options={this.state.practice_location_dropdown}
                      placeholder="Select Practice Location(s)"
                      value={this.state.formVal.practice_location_id}
                    />
                  </div>
                </div>
                <div className="col-sm-6">

                <div className="form-group">
                  <label className="control-label">Practice Area(s)</label>
                    <Select
                      multi
                      closeOnSelect = {false}
                      onBlurResetsInput = {true}
                      onBlur={this.handleInputOnBlur}
                      autosize = {false}
                      onChange={(value) => this.logChange(value,'practice_area_id')}
                      options={this.state.practice_area_dropdown}
                      placeholder="Select Practice Area(s)"
                      value={this.state.formVal.practice_area_id}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label htmlFor="" className="control-label">INTERESTED IN HIRING (NOW OR IN THE FUTURE)</label>
                    <Select
                      multi
                      closeOnSelect = {false}
                      onBlurResetsInput = {true}
                      autosize = {false}
                      onChange={(value) => this.logChange(value,'intrested_in_id')}
                      options={this.state.category_dropdown}
                      placeholder="Select Interested in Hiring"
                      value={this.state.formVal.intrested_in_id}
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="additional-info-card card">
              <h4 style={{ marginBottom: 15 }}>Job Posting Information</h4>
              <p style={{ textAlign: 'left', marginBottom: 20 }}>In order to post a job you need to supply the following information.</p>

              <div className="row">
                <div className="col-sm-6">
                   <div className={this.state.formErrors.firm_name !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="" className="control-label">Firm name*</label>
                    <input onChange={this.handleUserInput} onBlur={this.handleInputOnBlur} type="text" name="firm_name" value={this.state.formVal.firm_name} id="fname" className="form-control" placeholder="Firm Name" />
                    <p><span>{this.state.formErrors.firm_name !== '' ? this.state.formErrors.firm_name : ''}</span></p>
                   </div>
                </div>
                <div className="col-sm-6">
                  <div className='form-group'>
                    <label htmlFor="" className="control-label">Title</label>
                    <input onChange={this.handleUserInput} name="title" onBlur={this.handleInputOnBlur} type="text" value={this.state.formVal.title} id="lname" className="form-control" placeholder="Title" />
                  </div>

                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className={this.state.formErrors.website_url !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="website_url" className="control-label">Website</label>
                    <input onChange={this.handleUserInput} name="website_url" onBlur={this.handleInputOnBlur} type="text" value={this.state.formVal.website_url} className="form-control" placeholder="Website" />
                    <p><span>{this.state.formErrors.website_url !== '' ? this.state.formErrors.website_url : ''}</span></p>
                  </div>
                </div>
              </div>

            </div>

            <div className="additional-info-card card">
              <h4 style={{ marginBottom: 15 }}>Freelance Project Posting Information</h4>
              <p style={{ textAlign: 'left', marginBottom: 20 }}>In order to post a freelance project you need to be a licensed attorney in good standing and provide the following information.</p>

              { this.state.formVal.bar_admission.map((item,index) => {

                    return <div className="row" key={index}>
                        <div className="col-sm-6">

                          <div className="form-group">
                            <label className="control-label">State*</label>
                            <div className={this.state.formErrors.bar_admission[index].bar_state_id !== '' ? 'select-wrapper global-error' : 'select-wrapper'}>
                              <select className="form-control pmd-select2" onBlur={(e) => this.handleInputOnBlur(e,index)} onChange={(e) => this.handleUserBarAdInput(index,e)} name="bar_state_id" value={item.bar_state_id}>
                                <option value="">Select State</option>
                                {this.state.state_dropdown}
                              </select>
                              <p><span>{this.state.formErrors.bar_admission[index].bar_state_id !== '' ? this.state.formErrors.bar_admission[index].bar_state_id : ''}</span></p>

                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">

                          <div className={this.state.formErrors.bar_admission[index].bar_registration_number !== '' ? 'form-group global-error' : 'form-group'} >
                            <label className="control-label">bar registration number*</label>
                            <input type="text" onBlur={(e) => this.handleInputOnBlur(e,index)} id="bar-reg-num" name="bar_registration_number" onChange={(e) => this.handleUserBarAdInput(index,e)} className="form-control uppercase" placeholder="Bar Registration Number" value={item.bar_registration_number}/>
                           <p><span>{this.state.formErrors.bar_admission[index].bar_registration_number !== '' ? this.state.formErrors.bar_admission[index].bar_registration_number : ''}</span></p>

                          </div>
                        </div>
                        <div className="clearfix"></div>

                      <div className="row add-more-wrapper m-0">
                        <a className={index == (this.state.formVal.bar_admission.length-1) ? "add-more" : "add-more d-none"} onClick={this.createBarAdmissionContainer}><img src={constant['IMG_PATH'] + 'add-more-icon.png'} alt="add more"/>Add More</a>
                        <a className={index!== 0 ? "delete-more" : "delete-more d-none"} onClick={(e) => this.deleteBar(index,e)}><img src={constant['IMG_PATH'] + 'delete-more.png'} alt="delete more" /> Delete</a>
                      </div>

                    </div>


                     })}

            </div> 

            <div className="nxt-prev-btns">
              <div className={this.state.editProfile == true ? "d-block" : "d-none"}>
                <button type="button" name="save&Next" className="nxt-btn btn-primary btn pull-right" onClick={this.handleInfoSubmit}> Save & Next </button >
                <button type="button" name="save" className="nxt-btn btn-primary btn pull-right mr-1p" onClick={this.handleInfoSubmit}> Save </button >
                <button type="button" className="nxt-btn btn-default btn pull-right mr-1p" onClick={() => utils.refreshPage()}> Cancel </button>
              </div>
              <button type="submit" name="save&Next" className={this.state.editProfile == true ? "d-none nxt-btn btn pull-right" : "d-block nxt-btn btn-primary btn pull-right"} onClick={this.handleInfoSubmit}> Next </button >
            </div>
            </div>
          </form>
        </Role>
    );
  }
}

