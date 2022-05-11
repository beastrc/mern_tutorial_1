import React from 'react';
import Select from 'react-select';

import { Role } from '../../../index';
import { config, constant, utils, cookieManager } from '../../../../shared/index';

export default class JobType extends React.Component {
  constructor (props) {
    super(props);
       this.state = {
        submitted:'',
        state_dropdown:[],
        stateId:[],
        state_name:'',
        work_permanent:'N',
        work_contract:'N',
        formErrors:{willing_to_work_location_id:''},
        formData:{
        "city":'',
        "state_id":'',
        "willing_to_work_locally": "Y",
        "willing_to_work_remotely": "N",
        "willing_to_work_full_time": "N",
        "willing_to_work_part_time": "N",
        "willing_to_work_location_id": [],
        "desired_job_type": [
          {
           "employment_type_id": null,
           "min_amount": 50000,
           "max_amount": 200000,
           "selected" : 'N'
          },
          {
           "employment_type_id": null,
           "min_amount": 0,
           "max_amount": 2000,
           "selected" : 'N'
          }
      ]
        },

      completeStatus : '',
      userImage : '',
      editProfile : false,
      profileComplete : false
    }

    this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
  }

  getAllDropdownsData() {
    let that = this;
    let states = [];

    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);

          for (let statesObj of data['states']) {
            states.push({value: statesObj['_id'], label: statesObj['name']});
          }
          that.setState({state_dropdown: states});

          for (var eTypesObj of data['employment_types']) {
            if (eTypesObj['name'] === 'Permanent') {
              that.state['formData']['desired_job_type'][0]['employment_type_id'] = eTypesObj['_id'];
            } else if (eTypesObj['name'] === 'Contract') {
              that.state['formData']['desired_job_type'][1]['employment_type_id'] = eTypesObj['_id'];
            }
          }
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  componentDidMount() {
    var pmdSliderValueInput = document.getElementById('pmd-slider-value-input');
    this.refs.willing_to_work_locally.checked = true;
    this.getAllDropdownsData();
    var formVal;
    var thisObj = this;
    var valueInput = document.getElementById('value-input');
        $('.work-within .pmd-checkbox > input[type=checkbox]').change(function() {
          formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
            $('.location-slider-wrapper').removeClass("slider-disabled");
            formVal.willing_to_work_locally = 'Y';
            formVal.willing_to_work_location_id = [cookieManager.get('stateId')];
          } else {
            $('.location-slider-wrapper').addClass("slider-disabled");
            formVal.willing_to_work_locally = 'N';
            formVal.willing_to_work_location_id = [];
          }

          thisObj.setState({formData : formVal},function(){
            thisObj.logChange();
          });
        });

        $('.work-permanent .pmd-checkbox > input[type=checkbox]').change(function() {
          formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
            $('.permanent-slidder-wrapper').removeClass("slider-disabled");
          } else {
            $('.permanent-slidder-wrapper').addClass("slider-disabled");
          }
        });

        $('.work-contract .pmd-checkbox > input[type=checkbox]').change(function() {
          formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
            $('.contract-slidder-wrapper').removeClass("slider-disabled");
          } else {
            $('.contract-slidder-wrapper').addClass("slider-disabled");
          }
        });
        $('.work-part-time .pmd-checkbox > input[type=checkbox]').change(function() {
          formVal = thisObj.state.formData;
        });
        $('.work-full-time .pmd-checkbox > input[type=checkbox]').change(function() {
          formVal = thisObj.state.formData;
        });
        $('.work-remotely .pmd-checkbox > input[type=checkbox]').change(function() {
          formVal = thisObj.state.formData;
        });

    let that = this;

    utils.apiCall('GET_USER_PROFILE', { 'params': ['job_seeker_info', 'job_posters_info'] }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting User Profile');
        utils.logger('error', 'Get User Profile Error -->', err);
      } else {
        let apiConfig = config.getConfiguration();
        let s3BucketUrl = apiConfig.S3_BUCKET_URL;
        let formData =  Object.assign({},that.state.formData);

        if (response.data.Code == 200 && response.data.Status == true) {
          var userData = utils.getCurrentUser();
          var photoUrl = response.data.Data.job_seeker_info.network.photo;
          if (userData) {
            var image = photoUrl ? (s3BucketUrl + photoUrl) : '';
            that.setState({userImage : image});
            userData.image = image;
            cookieManager.setObject('currentUser', userData);
            that.props.forceUpdateHeader();
          }

          if (response.data.Data.job_seeker_info.is_profile_completed == 'Y') {
            that.setState({editProfile : true, profileComplete : true});
          } else {
            that.setState({editProfile : false , profileComplete : false});
          }
          let data = response.data.Data.job_seeker_info.job_profile;
          formData.city = data.city;
          formData.state_id = data.state_id;
          that.state.state_name = data.state_name;
          formData.willing_to_work_location_id = data.willing_to_work_location_id;
          cookieManager.set('stateId', data.willing_to_work_location_id);
          formData.willing_to_work_locally = data.willing_to_work_locally;

          if (data.willing_to_work_locally == 'Y') {
            that.refs.willing_to_work_locally.checked = true;
          } else {
            that.refs.willing_to_work_locally.checked = false;
          }

          if (data.willing_to_work_part_time == 'Y') {
            that.refs.willing_to_work_part_time.checked = true;
            formData.willing_to_work_part_time = data.willing_to_work_part_time;
          }

          if (data.willing_to_work_remotely == 'Y') {
            that.refs.willing_to_work_remotely.checked = true;
            formData.willing_to_work_remotely = data.willing_to_work_remotely;
          }

          if (data.willing_to_work_full_time == 'Y') {
            that.refs.willing_to_work_full_time.checked = true;
            formData.willing_to_work_full_time = data.willing_to_work_full_time;
          }

          if (data.desired_job_type.length > 0) {
            if(data.desired_job_type[0].selected == 'Y'){
              formData.desired_job_type[0].selected = 'Y';
              that.setState({work_permanent: 'Y'});
              that.multiPermanentRange(data['desired_job_type'][0]['min_amount'],data['desired_job_type'][0]['max_amount']);
              that.refs.work_permanent.checked = true;
              $('.permanent-slidder-wrapper').removeClass("slider-disabled");
            } else {
              that.multiPermanentRange(data['desired_job_type'][0]['min_amount'],data['desired_job_type'][0]['max_amount']);
            }
            if (data.desired_job_type[1].selected == 'Y') {
              formData.desired_job_type[1].selected = 'Y';
              that.setState({work_contract: 'Y'});
              that.multiContractRange(data['desired_job_type'][1]['min_amount'],data['desired_job_type'][1]['max_amount']);
              that.refs.work_contract.checked = true;
              $('.contract-slidder-wrapper').removeClass("slider-disabled");
            } else{
              that.multiContractRange(data['desired_job_type'][1]['min_amount'],data['desired_job_type'][1]['max_amount']);
            }

            document.getElementById('permanent-value-min').innerHTML = "$"+data['desired_job_type'][0]['min_amount'];
            document.getElementById('permanent-value-max').innerHTML = "$"+data['desired_job_type'][0]['max_amount'];
            formData['desired_job_type'][0]['min_amount'] = data['desired_job_type'][0]['min_amount'];
            formData['desired_job_type'][0]['max_amount'] = data['desired_job_type'][0]['max_amount'];
            document.getElementById('contract-value-min').innerHTML = "$"+data['desired_job_type'][1]['min_amount'];
            document.getElementById('contract-value-max').innerHTML = "$"+data['desired_job_type'][1]['max_amount'];
            formData['desired_job_type'][1]['min_amount'] = data['desired_job_type'][1]['min_amount'];
            formData['desired_job_type'][1]['max_amount'] = data['desired_job_type'][1]['max_amount'];
          } else {
            that.multiPermanentRange(50000, 200000);
            that.multiContractRange(0, 2000);
          }
          that.setState({formData});
          that.setState({completeStatus : response.data.Data.job_seeker_info.last_visited_page});
        } else {
          utils.flashMsg('show', response.data.Message);
        }
      }
    });
  }
  multiPermanentRange(val1, val2) {
    // pmd slider with multiple handler values

     if(!val1) {
      val1 = 50000;
     }
     if(!val2) {
      val2 = 200000;
     }
     var pmdSliderValueRange = document.getElementById('pmd-slider-permanent-rate');

     noUiSlider.create(pmdSliderValueRange, {
       start: [ val1, val2 ], // Handle start position
       connect: true, // Display a colored bar between the handles
       tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
       format: wNumb({
         decimals: 0,
         thousand: ',',
         prefix: '$',
         postfix: '',
       }),
       range: { // Slider can select '0' to '100'
         'min': 50000,
         'max': 200000
       },
       step: 1000
     });

     var valueMaxPermanent = document.getElementById('permanent-value-max'),
       valueMinPermanent = document.getElementById('permanent-value-min');

     // When the slider value changes, update the input and span
     pmdSliderValueRange.noUiSlider.on('update', function( values, handle ) {
       if ( handle ) {
         valueMaxPermanent.innerHTML = values[handle];

       } else {
         valueMinPermanent.innerHTML = values[handle];
       }
     });
     ///////////////////////

  }

  multiContractRange(val1,val2){

   if(!val1){
    val1 = 0;
   }
   if(!val2){
    val2 = (val2 == 0) ? 0 : 2000;
   }
   // pmd slider with multiple handler values
   var pmdSliderValueRange = document.getElementById('pmd-slider-contract-rate');

   noUiSlider.create(pmdSliderValueRange, {
     start: [ val1,val2 ], // Handle start position
     connect: true, // Display a colored bar between the handles
     tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
     format: wNumb({
       decimals: 0,
       thousand: ',',
       prefix: '$',
       postfix: '',
     }),
     range: { // Slider can select '0' to '100'
       'min': 0,
       'max': 2000
     },
     step:10

   });

   var valueMaxContract = document.getElementById('contract-value-max'),
     valueMinContract = document.getElementById('contract-value-min');

   // When the slider value changes, update the input and span
   pmdSliderValueRange.noUiSlider.on('update', function( values, handle ) {
     if ( handle ) {
       valueMaxContract.innerHTML = values[handle];
     } else {
       valueMinContract.innerHTML = values[handle];
     }
   });
  }

  handleInput(e){

    const target = e.target;
    const name = target.name;
    let formD = Object.assign({}, this.state.formData);

    if(name == "willing_to_work_locally" || name == "willing_to_work_remotely" || name == "willing_to_work_full_time" || name == "willing_to_work_part_time"){
         if(target.value == 'N'){
          formD[e.target.name] = 'Y';
         }
         else{
          formD[e.target.name] = 'N';
         }
     this.setState({formD});
    }
    else if(name == "work_permanent" || name == "work_contract"){
      if(target.value == 'N'){
       this.setState({[e.target.name]:'Y'});
           if(name == 'work_contract'){
             formD['desired_job_type'][1]['min_amount'] = 0;
             formD['desired_job_type'][1]['max_amount'] = 2000;
             formD['desired_job_type'][1]['selected'] = 'N';
           }
           else if(name == "work_permanent"){
            formD['desired_job_type'][0]['min_amount'] = 50000;
            formD['desired_job_type'][0]['max_amount'] = 200000;
            formD['desired_job_type'][0]['selected'] = 'N';

           }
      }
      else{
       this.setState({[e.target.name]:'N'});
           if(name == 'work-contract'){
            formD['desired_job_type'][0]['min_amount'] = (document.getElementById('permanent-value-min').innerHTML).replace("$","");
            formD['desired_job_type'][0]['max_amount'] = (document.getElementById('permanent-value-max').innerHTML).replace("$","");
            formD['desired_job_type'][1]['selected'] = 'Y';
           }
           else if(name == 'work_permanent'){
            formD['desired_job_type'][1]['min_amount'] = (document.getElementById('permanent-value-min').innerHTML).replace("$","");
            formD['desired_job_type'][1]['max_amount'] = (document.getElementById('permanent-value-max').innerHTML).replace("$","");
            formD['desired_job_type'][1]['selected'] = 'Y';
           }
      }
    }
   this.setState({formData : formD});
  }

  handleProceed(e){
   // window.scrollTo(0,0);
    let obj = { 'job_seeker_info' : {
      'job_profile' : {}
    }}
    let callFrom = e.target.name;
    let formData = Object.assign({},this.state.formData);
   // formData['willing_to_work_within'] = (document.getElementById('value-input').value).replace("Miles","");
    if(this.state.work_permanent == 'Y') {
      formData['desired_job_type'][0]['min_amount'] = (document.getElementById('permanent-value-min').innerHTML).replace("$","");
      formData['desired_job_type'][0]['max_amount'] = (document.getElementById('permanent-value-max').innerHTML).replace("$","");
      formData['desired_job_type'][0]['min_amount'] = formData['desired_job_type'][0]['min_amount'].replace(/,/g, "");
      formData['desired_job_type'][0]['max_amount'] = formData['desired_job_type'][0]['max_amount'].replace(/,/g, "");

      formData['desired_job_type'][0]['selected'] = 'Y';
    } else {
      formData['desired_job_type'][0]['min_amount'] = 50000;
      formData['desired_job_type'][0]['max_amount'] = 200000;

      formData['desired_job_type'][0]['selected'] = 'N';
    }
    // formData['desired_job_type'][0]['employment_type_id'] = this.state.desired_job_type[0]['employment_type_id'];

    if(this.state.work_contract == 'Y') {
      formData['desired_job_type'][1]['min_amount'] = (document.getElementById('contract-value-min').innerHTML).replace("$","");
      formData['desired_job_type'][1]['max_amount'] = (document.getElementById('contract-value-max').innerHTML).replace("$","");
      formData['desired_job_type'][1]['min_amount'] = formData['desired_job_type'][1]['min_amount'].replace(/,/g, "");
      formData['desired_job_type'][1]['max_amount'] = formData['desired_job_type'][1]['max_amount'].replace(/,/g, "");

      formData['desired_job_type'][1]['selected'] = 'Y';
    }
    else {
      formData['desired_job_type'][1]['min_amount'] = 0;
      formData['desired_job_type'][1]['max_amount'] = 2000;

      formData['desired_job_type'][1]['selected'] = 'N';
    }
    // formData['desired_job_type'][1]['employment_type_id'] = this.state.desired_job_type[1]['employment_type_id'];

    let _this = this;
    obj.job_seeker_info.job_profile = formData;
    this.setState({formData}, function() {
      if(!_this.state.formErrors.willing_to_work_location_id){
        utils.apiCall('SET_USER_JOB_PROFILE', { 'data': obj }, function(err, response) {
          if (err) {
            utils.flashMsg('show', 'Error while setting User Job Profile');
            utils.logger('error', 'Set User Job Profile Error -->', err);
          } else {
            if (response.data.Code == 200 && response.data.Status == true) {
              let userData = utils.getCurrentUser();
              if (userData) {
                userData.is_seeker_profile_completed = true;
                cookieManager.setObject('currentUser', userData);
              }
              _this.setState({submitted:true});
              if (callFrom == "save") {
                utils.flashMsg('show', constant.SUCCESS_UPDATE_PROFILE, 'success');
              } else {
                utils.changeUrl(constant['ROUTES_PATH']['SEEKER_GET_STARTED']);
              }
            } else {
              window.scrollTo(0, 0);
              utils.flashMsg('show', response.data.Message);
            }
          }
        });
      }
    });
  }

  logChange(val) {
    let list = [];
    if (val) {
      for(var key in val){
        list.push(val[key].value);
      }
    }
    var fieldValidationErrors = Object.assign({},this.state.formErrors);
    var formData = Object.assign({},this.state.formData);
    formData.willing_to_work_location_id = list;
    if(formData.willing_to_work_location_id.length <=0 && this.refs.willing_to_work_locally.checked){
      fieldValidationErrors.willing_to_work_location_id = constant.ENTER_LOCATION;
    } else if(formData.willing_to_work_location_id.length <=0 && !this.refs.willing_to_work_locally.checked){
      fieldValidationErrors.willing_to_work_location_id = '';
    } else {
      fieldValidationErrors.willing_to_work_location_id = '';
      this.refs.willing_to_work_locally.checked = true;
      formData.willing_to_work_locally = 'Y';
    }
    this.setState({formErrors:fieldValidationErrors});
    this.setState({formData});
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <Role step="job_type" role="seeker" profileStatus={this.state.completeStatus}>
        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={() => utils.changeUrl(routesPath['SEEKER_HEADLINE'])}></span> Job Type<span className={this.state.completeStatus >= 4 ? 'next' : 'next disabled-element'} onClick={() => utils.changeUrl(routesPath['SEEKER_GET_STARTED'])}></span> </div>
          <div className="job-form form">
            <div className="job-card card">
              <h4>Job Type</h4>
              <h5>Location</h5>
            <div className="work-within checkbox pmd-default-theme row m-0">
              <label className="pmd-checkbox col-sm-3 pt-5">
                <input ref="willing_to_work_locally" value={this.state.formData.willing_to_work_locally} name="willing_to_work_locally" onChange={this.handleInput.bind(this)} type="checkbox" /><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Willing to work in</span>
              </label>

             <div className={this.state.formErrors.willing_to_work_location_id !== '' ? 'select-parent col-sm-6 global-error' : 'select-parent col-sm-6'}>
                <Select
                  multi
                  closeOnSelect = {false}
                  onBlurResetsInput = {true}
                  autosize = {false}
                  onNewOptionClick={(value) => this.logChange(value)}
                  onChange={(value) => this.logChange(value,'skill_used_id')}
                  options={this.state.state_dropdown}
                  placeholder="States"
                  value={this.state.formData.willing_to_work_location_id}
                />
                <span className="col-sm-3 pl-0 full-width clr">{this.state.formErrors.willing_to_work_location_id !== '' ? this.state.formErrors.willing_to_work_location_id : ''}</span>
              </div>


            </div>


            <div className="work-remotely checkbox pmd-default-theme m-0">
              <label className="pmd-checkbox">
                <input ref="willing_to_work_remotely" type="checkbox" value={this.state.formData.willing_to_work_remotely} name="willing_to_work_remotely" onChange={this.handleInput.bind(this)}/><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Willing to work Remotely</span>
              </label>
            </div>

            <h5>Desired hours</h5>
            <div className="work-part-time checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input ref="willing_to_work_part_time" type="checkbox" value={this.state.formData.willing_to_work_part_time} name ="willing_to_work_part_time" onChange={this.handleInput.bind(this)}/><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Willing to work part-time</span>
              </label>
            </div>

            <div className="work-full-time checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input  ref="willing_to_work_full_time" type="checkbox" value={this.state.formData.willing_to_work_full_time} name="willing_to_work_full_time" onChange={this.handleInput.bind(this)}/><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Willing to work full-time</span>
              </label>
            </div>

            <h5>Desired job type and compensation</h5>
            <div className="work-permanent checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input  ref="work_permanent" name="work_permanent" type="checkbox" value={this.state.work_permanent}  onChange={this.handleInput.bind(this)}/><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Permanent (Salaried)</span>
              </label>

              <span className="permanent-slidder-wrapper slider-disabled">

                <span className="range-value">
                  <span id="permanent-value-min"></span>
                </span>

                <span id="pmd-slider-permanent-rate" className="pmd-range-slider noUi-target noUi-ltr noUi-horizontal noUi-background">

                </span>

                <span className="range-value text-right ">
                  <span id="permanent-value-max"></span>
                </span>
              </span>
            </div>

            <div className="work-contract checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input ref="work_contract" name="work_contract" type="checkbox" value={this.state.work_contract} onChange={this.handleInput.bind(this)} /><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Contract (Hourly Rate)</span>
              </label>

              <span className="contract-slidder-wrapper slider-disabled">

                <span className="range-value">
                  <span id="contract-value-min"></span>
                </span>

                <span id="pmd-slider-contract-rate" className="pmd-range-slider noUi-target noUi-ltr noUi-horizontal noUi-background"></span>

                <span className="range-value text-right ">
                  <span id="contract-value-max"></span>
                </span>
              </span>
            </div>

          </div>

          <div className="nxt-prev-btns">
            <button type="button" onClick={() => utils.changeUrl(routesPath['SEEKER_HEADLINE'])} className="previouse-btn btn pull-left"> Previous </button>
            <div className={this.state.editProfile == true ? "d-block" : "d-none"}>
                <button type="button" name="save&Next" className="nxt-btn btn-primary btn pull-right" onClick={this.handleProceed.bind(this)}> Save & Next </button >
                <button type="button" name="save" className="nxt-btn btn-primary btn pull-right mr-1p" onClick={this.handleProceed.bind(this)}> Save </button >
                <button type="button" className="nxt-btn btn-default btn pull-right mr-1p" onClick={() => utils.refreshPage()}> Cancel </button>
              </div>
              <button type="submit" name="save&Next" onClick={this.handleProceed.bind(this)} className={this.state.editProfile == true ? "d-none nxt-btn btn pull-right" : "d-block nxt-btn btn-primary btn pull-right"}> Next </button >
            <span className="clear-fix"></span>
          </div>
        </div>
      </Role>
    );
  }
}
