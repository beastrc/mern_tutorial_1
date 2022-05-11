import React from 'react';
import moment from 'moment';
import Datetime from 'react-datetime';
import Select from 'react-select';
var Multiselect = require('react-widgets').Multiselect;

import { Role } from '../../../index';
import { constant, utils, cookieManager } from '../../../../shared/index';

export default class Experience extends React.Component {
  constructor(props) {
          super(props);
          this.state = {
           formObj: {'job_seeker_info' : {}},
           showHide : {display: 'inline-block'},
             formErrors: {experience: [{company_name: '',designation: '', start_date: '',end_date: '',employment_type_id:'',experience_additional_information: '',others : ''}]},
             formVal: {
              experience: [
              {company_name: "",start_date: '',end_date: '',designation: '',employment_type_id :'',skill_used_id: [],skilled_used_other_text:'',experience_additional_information: "",others:'',present:'Y',showOthers : false}
              ]
            },
             employment_type_dropdown:[],
             skill_dropdown:[],
             token:'',
             completeStatus : '',
             startDate: moment(),
             editProfile : false,
             profileComplete : false,
             firstName : '',
             lastName : ''
          };
          this.limit = this.limit.bind(this);
          this.handleUserInput = this.handleUserInput.bind(this);
          this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
          this.createEducationContainer = this.createEducationContainer.bind(this);
          this.handleDateChange = this.handleDateChange.bind(this);
          this.handleExpSubmit = this.handleExpSubmit.bind(this);
          this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
          this.getUserProfile = this.getUserProfile.bind(this);
          this.validateField = this.validateField.bind(this);
          this.validateForm = this.validateForm.bind(this);
          this.logChange = this.logChange.bind(this);
          this.deleteExp = this.deleteExp.bind(this);
          this.openPicker = this.openPicker.bind(this);
          this.checkifAllEmpty = this.checkifAllEmpty.bind(this);
      }

    deleteExp(index){
     var formVal = this.state.formVal;
     var formErrors = this.state.formErrors;
     formVal.experience.splice(index,1);
     formErrors.experience.splice(index,1);
     this.setState({formVal});
     this.setState({formErrors});
    }

    logChange(val,type,i) {
      let list = [];var flag = false;
      var formVal = Object.assign({},this.state.formVal);
      for(var key in val){
            list.push(val[key].value);
            if(type == 'skill_used_id'){
                  if(val[key].label == 'Others'){
                    flag = true;
                  }

            }
      }
      if(!val.length){
        formVal.experience[i]['showOthers'] = false;
        formVal.experience[i]['others'] = '';

      }
      if(flag){
      formVal.experience[i]['showOthers'] = true;
      }
      else{
        formVal.experience[i]['showOthers'] = false;
        formVal.experience[i]['others'] = '';
      }
      formVal.experience[i][type] = list;
      this.setState({formVal});

    }

    componentDidMount() {
      window.scrollTo(0,0);
      // $(".select-simple").select2({
      //   theme: "bootstrap",
      //   minimumResultsForSearch: Infinity,
      // });

     // window.testSelAll2 = $('.testSelAll2').SumoSelect({selectAll:true});
      // this.createEmpItems();
      this.setState({token: utils.getToken()}, function() {
        this.getAllDropdownsData();
      });
    }

    getUserProfile(){
      let that = this;
      utils.apiCall('GET_USER_PROFILE', { 'params': ['job_seeker_info', 'job_posters_info'] }, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while getting User Profile');
          utils.logger('error', 'Get User Profile Error -->', err);
        } else {
          let formErrors= that.state.formErrors;
          let formVal = Object.assign({}, that.state.formVal);
          if (response.data.Code == 200 && response.data.Status == true) {
            let data = response.data.Data.job_seeker_info;
            var userData = utils.getCurrentUser();
            if (userData) {
              userData.first_name = response.data.Data.first_name;
              userData.last_name = response.data.Data.last_name;
              that.setState({firstName : response.data.Data.first_name, lastName : response.data.Data.last_name});
              cookieManager.setObject('currentUser', userData);
              that.props.forceUpdateHeader();
            }
            that.setState({completeStatus : data.last_visited_page});
            if (data.is_profile_completed == 'Y') {
              that.setState({editProfile : true, profileComplete : true});
            } else {
              that.setState({editProfile : false, profileComplete : false});
            }
            if (data.experience.length > 0) {
              formVal.experience = response.data.Data.job_seeker_info.experience;
              for (var i=0; i<(data.experience.length); i++) {
                if (data.experience[i].present == 'Y') {
                  formVal.experience[i].present = 'Y';
                }
                formVal.experience[i].start_date = data.experience[i].start_date || '';
                formVal.experience[i].end_date = data.experience[i].end_date || '';
              }
              for (var i=0; i<(data.experience.length-1); i++) {
                formVal.experience[i].start_date = data.experience[i].start_date || '';
                formVal.experience[i].end_date = data.experience[i].end_date || '';
                formErrors.experience.push ({
                  company_name: "",
                  designation: '',
                  start_date:'',
                  end_date: '',
                  employment_type_id: '',
                  experience_additional_information:''
                })
              }
              that.setState({formErrors});
              that.setState({formVal});
            }
          } else {
            utils.flashMsg('show', response.data.Message);
          }
        }
      })
    }

    handleUserInput(e, index) {
      let formVal = Object.assign({}, this.state.formVal);
      if ((e.target.name).indexOf('Present') >= 0) {
        formVal['experience'][index]['end_date'] = '';
        formVal['experience'][index]['present'] = e.target.value;
        this.setState({formVal});
      } else {
        formVal['experience'][index][e.target.name] = e.target.value;
        this.setState({formVal});
      }
    }

    handleInputOnBlur(e, index, str) {
      if (str === 'start_date' || str === 'end_date') {
        this.validateField(str, e, index);
        utils.onCalendarBlur(e);
      } else {
        this.setState({[e.target.name]: e.target.value});
        this.validateField(e.target.name, e.target.value,index);
      }
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
         case 'company_name':
          /* if(!value){
             fieldValidationErrors.experience[index].company_name = ' Please enter your company name';
           }
           else{*/
             if(value && value.length>100){
              fieldValidationErrors.experience[index].company_name = constant.INVALID_COMPANY_NAME_LENGTH;
             }
             else{
              fieldValidationErrors.experience[index].company_name = '';
             }

          // }
           break;
         case 'designation':
           /*if(!value){
             fieldValidationErrors.experience[index].designation = ' Please enter your designation';
           }
           else{
             fieldValidationErrors.experience[index].designation = '';
           }*/
           break;
         case 'employment_type_id':

          /* if(!value){

             fieldValidationErrors.experience[index].employment_type_id = 'Please enter your employment type';
           }else{

             fieldValidationErrors.experience[index].employment_type_id = '';
           }*/
           break;
         case 'start_date':
         /*  if(!value){

             fieldValidationErrors.experience[index].start_date = ' Please enter start date';
           }
           else{*/
             fieldValidationErrors.experience[index].start_date = '';
             if(value && moment(value).format(constant['DATE_FORMAT']) != 'Invalid date'){
              var _this = this;

                   if(_this.state.formVal.experience[index].end_date){

                    if(moment(_this.state.formVal.experience[index].end_date).diff(value)<0){

                      fieldValidationErrors.experience[index].start_date = constant.GREATER_START_DATE_ERROR;
                      this.setState({formErrors: fieldValidationErrors});
                    }
                    else{
                      fieldValidationErrors.experience[index].start_date = '';

                    }
                   }


           }
             else{

            fieldValidationErrors.experience[index].start_date = constant.INVALID_DATE;

           }
       //  }
           break;

         case 'end_date':
          /* if(!value){

             fieldValidationErrors.experience[index].end_date = ' Please enter end date';
           }
           else{*/
             fieldValidationErrors.experience[index].end_date = '';
             var _this = this;

              if(value && moment(value).diff(_this.state.formVal.experience[index].start_date)<0){
                fieldValidationErrors.experience[index].start_date = constant.GREATER_START_DATE_ERROR;
                this.setState({formErrors: fieldValidationErrors});
              }
              else{
                fieldValidationErrors.experience[index].start_date = '';

              }


        //   }
           break;
           case 'experience_additional_information':
           if(this.state.formVal.experience[index].experience_additional_information.length > 250){

              fieldValidationErrors.experience[index].experience_additional_information = constant.INVALID_ADD_INFO_LENGTH;
             }
             else{
               fieldValidationErrors.experience[index].experience_additional_information = '';
            }

            break;
           default:
           break;
       }


         this.setState({formErrors: fieldValidationErrors});

       }

       createEducationContainer(){

          var formVal = this.state.formVal;
          var formErrors = this.state.formErrors;

          formVal.experience.push({
                   company_name: "",
                   designation: '',
                   start_date:'',
                   end_date: '',
                   employment_type_id: '',
                   skill_used_id: [],
                   skilled_used_other_text: '',
                   experience_additional_information: "",
                   others:'',
                   present:'N',
                   showOthers : false
                  })
          formErrors.experience.push({
                  company_name: "",
                   designation: '',
                   start_date:'',
                   end_date: '',
                   employment_type_id: '',
                   experience_additional_information:'',
                   others : ''
                  })
          this.setState({formVal});
          this.setState({formErrors});

       }
    checkifAllEmpty(index){
      if(index != 0){
        let experience =  this.state.formVal.experience;
        if(!experience[index].company_name && !experience[index].experience_additional_information && !(experience[index].employment_type_id.length>0) && !experience[index].designation && !(experience[index].skill_used_id.length>0)){
           this.deleteExp(index);
        }
      }

    }

  handleExpSubmit(e) {
    e.preventDefault();
    window.scrollTo(0,0);
    let callFrom = e.target.name;
    let obj = {'job_seeker_info' : {}};
    obj.job_seeker_info = this.state.formVal;
    let fieldValidationErrors = this.state.formErrors;
    for(var i=0;i<(fieldValidationErrors.experience).length;i++){
      let exp = this.state.formVal.experience;
      if(!fieldValidationErrors.experience[i].company_name){
        fieldValidationErrors.experience[i].company_name = '';
      }
      if(!fieldValidationErrors.experience[i].start_date){
        fieldValidationErrors.experience[i].start_date = '';
      }
      if(!fieldValidationErrors.experience[i].end_date || exp[i].end_date== "Invalid date"){
        fieldValidationErrors.experience[i].end_date = '';
      }
      if(exp[i].end_date== "Invalid date"){
        exp[i].end_date = '';
      }
      if(this.state.formVal.experience[i].experience_additional_information.length > 250){
        fieldValidationErrors.experience[i].experience_additional_information = constant.INVALID_ADD_INFO_LENGTH;
      }
      else{
        fieldValidationErrors.experience[i].experience_additional_information = '';
      }
      this.checkifAllEmpty(i);
    }
    this.setState({formErrors: fieldValidationErrors});
    var _this = this;
    if (_this.validateForm()) {
      utils.apiCall('SET_USER_EXPERIENCE_PROFILE', { 'data': obj }, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while setting User Experience Profile');
          utils.logger('error', 'Set User Experience Profile Error -->', err);
        } else {
          if (response.data.Code == 200 && response.data.Status == true) {
            if (callFrom == "save") {
              utils.flashMsg('show', constant.SUCCESS_UPDATE_PROFILE, 'success');
            } else {
              utils.changeUrl(constant['ROUTES_PATH']['SEEKER_HEADLINE']);
            }
          } else {
            utils.flashMsg('show', response.data.Message);
          }
        }
      })
    }
  }

    validateForm() {
      let flag = true;
      for(var key in this.state.formErrors){
          if(key == 'experience'){
            for(var j in this.state.formErrors.experience){
              for(var k in this.state.formErrors.experience[j]){
                if(this.state.formErrors.experience[j][k]){
                 flag = false;
                 return flag;
                }
              }

            }
          }
         return flag;
      }
       //formErrors: {company_name: '',designation: '', start_date: '',end_date: '',employment_type_id:''},
    }

  getAllDropdownsData() {
    let that = this;
    let employmentTypes = [];
    let skills = [];

    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);

          for (let eTypesObj of data['employment_types']) {
            employmentTypes.push({value: eTypesObj['_id'], label: eTypesObj['name']});
          }
          that.setState({employment_type_dropdown: employmentTypes});

          for (let skillsObj of data['skills']) {
            skills.push({value: skillsObj['_id'], label: skillsObj['name']});
          }
          that.setState({skill_dropdown: skills});
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
        that.getUserProfile();
      }
    });
  }

  openPicker(){
    this._child.openCalendar();
  }

  handleDateChange(date, index, keyName) {
    let formval = this.state.formVal;
    let formErrors = this.state.formErrors;
    formval['experience'][index][keyName] = (moment.isMoment(date) ? date.format(constant['DATE_FORMAT']) : date);
    (date === '') && (formErrors.experience[index]['start_date'] = date);
    this.setState({formval, formErrors})
  }

  validStartAndEndDate(current) {
    return (moment(current.format(constant['DATE_FORMAT'])).isSameOrBefore(utils.getCurrentEstDate()));
  }

  renderDay(props, currentDate, selectedDate) {
    return (<td {...utils.getUpdatedCalenderProps(props, currentDate)}>{ currentDate.date() } </td>);
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <Role step="experience" role="seeker" profileStatus={this.state.completeStatus}>
        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={() => utils.changeUrl(routesPath['SEEKER_BASIC_INFO'])}></span> Experience <span onClick={() => utils.changeUrl(routesPath['SEEKER_HEADLINE'])} className={this.state.completeStatus >= 2 ? 'next' : 'next disabled-element'}></span> </div>
          <form onSubmit={this.handleExpSubmit}>
            <div className="form experience-form">

              <div className="experience-card card">
                <h4>Experience</h4>

                 {this.state.formVal.experience.map((item,index) => {

                  return <div key={index}>
                  <div className="row">
                  <div className="col-sm-6">

                    <div className={this.state.formErrors.experience[index].company_name !== '' ? 'form-group global-error' : 'form-group'}>
                      <label htmlFor="company_name" className="control-label">company name</label>
                      <input value={item.company_name} onBlur={(e) => this.handleInputOnBlur(e, index)} onChange={(e) => this.handleUserInput(e,index)} name="company_name" onKeyDown={(e) => this.limit(100,e)} type="text" id="comp-name" className="form-control" placeholder="Company Name"/>
                      <p><span>{this.state.formErrors.experience[index].company_name !== '' ? this.state.formErrors.experience[index].company_name : ''}</span></p>

                    </div>
                  </div>
                  <div className="col-sm-6">

                    <div className={this.state.formErrors.experience[index].designation !== '' ? 'form-group global-error' : 'form-group'}>
                      <label className="control-label">Title</label>
                      <input value={item.designation}  onBlur={(e) => this.handleInputOnBlur(e, index)} onChange={(e) => this.handleUserInput(e,index)} onKeyDown={(e) => this.limit(100,e)} name="designation" type="text" id="designation" className="form-control" placeholder="Title"/>
                      <p><span>{this.state.formErrors.experience[index].designation !== '' ? this.state.formErrors.experience[index].designation : ''}</span></p>

                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6 group-radio">
                    <div className="row m-0">
                      <div className="radio-label mb-10">Is This Your Current Employer?</div>

                  <ul className="list radio-list m-0">
                        <li className="list__item">
                         <input id={'a'+index} type="radio" className="radio-btn" name={"Present"+index} onChange={(e) => this.handleUserInput(e,index)} checked={item.present === 'Y'} value='Y'/>
                         <label htmlFor={'a'+index} className="label p-0">Yes</label>
                        </li>
                        <li className="list__item m-10">
                         <input id={'b'+index} type="radio" className="radio-btn" name={"Present"+index} onChange={(e) => this.handleUserInput(e,index)} checked={item.present ==='N'} value="N"/>
                         <label htmlFor={'b'+index} className="label p-0">No</label>
                        </li>
                    </ul>
                    </div>
                  </div>

                  <div className="col-sm-6">

                    <div className="form-group ml-0 mr-0 mb-0">
                      <label htmlFor="" className="control-label">duration</label>
                      <div className="row">
                        <div className={this.state.formErrors.experience[index].start_date !== '' ? 'start-date form-group global-error col-xs-12 col-sm-6 mb-20' : 'start-date form-group col-xs-12 col-sm-6 mb-20'}>
                          <Datetime onChange={(date) => this.handleDateChange(date, index, 'start_date')}
                            value={item.start_date}
                            input={true}
                            inputProps={{placeholder: 'From', name: 'searchStartDate', readOnly: true}}
                            name='start_date'
                            closeOnSelect={true}
                            dateFormat={constant['DATE_FORMAT']}
                            timeFormat={false}
                            isValidDate={ this.validStartAndEndDate }
                            renderDay={ this.renderDay }
                            onBlur={(date) => this.handleInputOnBlur(date, index, 'start_date')}
                            className={ 'date-time' }
                          />
                          { item.start_date ?
                              <span className="clear" onClick={(e) => this.handleDateChange('', index, 'start_date')}></span>
                            :
                              null
                          }
                          <p className="m-0"><span>{this.state.formErrors.experience[index].start_date !== '' ? this.state.formErrors.experience[index].start_date : null}</span></p>
                        </div>
                        <div className={item.present == 'Y'? 'd-none' : this.state.formErrors.experience[index].end_date  ? 'end-date form-group global-error  col-xs-12 col-sm-6 m-0' : 'end-date form-group col-xs-12 col-sm-6 m-0'}>
                          <Datetime ref={(dateTimeObj) => { this._child = dateTimeObj; }} onChange={(date) => this.handleDateChange(date, index, 'end_date')}
                            value={item.end_date}
                            input={true}
                            inputProps={{placeholder:'To', name:'searchStartDate', readOnly:true}}
                            name='end_date'
                            closeOnSelect={true}
                            dateFormat={constant['DATE_FORMAT']}
                            timeFormat={false}
                            isValidDate={ this.validStartAndEndDate }
                            renderDay={ this.renderDay }
                            onBlur={(date) => this.handleInputOnBlur(date, index, 'end_date')}
                            className={ 'date-time' }
                          />
                          { item.end_date ?
                              <span className="clear" onClick={(e) => this.handleDateChange('', index, 'end_date')}></span>
                            :
                              null
                          }
                          <p><span>{this.state.formErrors.experience[index].end_date !== '' ? this.state.formErrors.experience[index].end_date : null}</span></p>
                        </div>
                        <span className={item.present == 'Y' ? 'present form-group col-xs-12 col-sm-6':'d-none'}>Present</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">

                    <div className={this.state.formErrors.experience[index].employment_type_id !== '' ? 'form-group global-error' : 'form-group'}>

                      <label htmlFor="" className="control-label">Employment type</label>

                      <div className="select-wrapper">
                        <Select
                          multi
                          closeOnSelect = {false}
                          onBlurResetsInput = {true}
                          autosize = {false}
                          onNewOptionClick={(value) => this.logChange(value,index)}
                          onChange={(value) => this.logChange(value,'employment_type_id',index)}
                          options={this.state.employment_type_dropdown}
                          placeholder="Employment type"
                          value={item.employment_type_id}
                        />
                      </div>
                     <p><span>{this.state.formErrors.experience[index].employment_type_id !== '' ? this.state.formErrors.experience[index].employment_type_id : ''}</span></p>

                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className={this.state.formErrors.experience[index].experience_additional_information !== '' ? 'form-group global-error' : 'form-group'} >
                      <label htmlFor="experience_additional_information" className="control-label">additional information</label>
                      <input value={item.experience_additional_information} onBlur={(e) => this.handleInputOnBlur(e, index)} onChange={(e) => this.handleUserInput(e,index)} name="experience_additional_information" onKeyDown={(e) => this.limit(250,e)} type="text" id="additional-info" className="form-control" placeholder="Additional Information"/>
                      <p><span>{this.state.formErrors.experience[index].experience_additional_information !== '' ? this.state.formErrors.experience[index].experience_additional_information : ''}</span></p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="form-group">
                      <label htmlFor="skilled_used_other_text" className="control-label">Skills Used</label>
                      <Select
                        multi
                        closeOnSelect = {false}
                        onBlurResetsInput = {true}
                        autosize = {false}
                        onNewOptionClick={(value) => this.logChange(value,index)}
                        onChange={(value) => this.logChange(value,'skill_used_id',index)}
                        options={this.state.skill_dropdown}
                        placeholder="Skills Used"
                        value={item.skill_used_id}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className={(item.showOthers == 'true' || item.showOthers == true) ? 'form-group' : 'form-group d-none'} >
                      <label htmlFor="Others" className="control-label">Others</label>
                      <input value={item.others} onBlur={(e) => this.handleInputOnBlur(e, index)} onChange={(e) => this.handleUserInput(e,index)} name="others" type="text" id="others" className="form-control" placeholder="Others"/>
                      <p><span>{this.state.formErrors.experience[index].others !== '' ? this.state.formErrors.experience[index].others : ''}</span></p>
                    </div>
                  </div>
                </div>

                <div className="separator mb-10"></div>


                <div className="row add-more-wrapper">
                  <a className={index == (this.state.formVal.experience.length-1) ? "add-more" : "add-more d-none"}  onClick={this.createEducationContainer}><img src={constant['IMG_PATH'] + 'add-more-icon.png'} alt="add more"/>Add More</a>
                  <a className={index!== 0 ? "delete-more" : "delete-more d-none"} onClick={(e) => this.deleteExp(index,e)}><img src={constant['IMG_PATH'] + 'delete-more.png'} alt="delete more" /> Delete</a>
                </div>
                </div>
                })}
              </div>


              <div className="nxt-prev-btns">
                <button type="click" onClick={() => utils.changeUrl(routesPath['SEEKER_BASIC_INFO'])} className="previouse-btn btn pull-left mb-10">Previous</button >
                <div className={this.state.editProfile == true ? "d-block" : "d-none"}>
                    <button type="button" name="save&Next" className="nxt-btn btn-primary btn pull-right" onClick={this.handleExpSubmit}> Save & Next </button >
                    <button type="button" name="save" className="nxt-btn btn-primary btn pull-right mr-1p" onClick={this.handleExpSubmit}> Save </button >
                    <button type="button" className="nxt-btn btn-default btn pull-right mr-1p" onClick={() => utils.refreshPage()}> Cancel </button>
                  </div>
                  <button type="submit" name="save&Next" onClick={this.handleExpSubmit} className={this.state.editProfile == true ? "d-none nxt-btn btn pull-right" : "d-block nxt-btn btn-primary btn pull-right"}> Next </button >
                <span className="clear-fix"></span>
              </div>
            </div>
          </form>
   </Role>
         );
       }
     }

