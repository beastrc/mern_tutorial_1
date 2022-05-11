import React from 'react';
import { Link, browserHistory } from 'react-router';
var Recaptcha = require('react-recaptcha');

import { LegablyLargeFooter } from '../../index';
import { config, constant, utils } from '../../../shared/index';

let recaptchaInstance;
export default class ContactUs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    	first_name : '',
      last_name : '',
      email: '',
      subject: '',
      message: '',
    	formErrors: {first_name: '', last_name: '', email: '', subject:'', message : '',recapcthaValidErr:''},
    	fnameValid: false,
      lnameValid: false,
      emailValid: false,
      subjectValid: false,
      messageValid: false,
    	token : '',
    	recapcthaValid : '',
      disableButton : false,
      sitekey: ''
  	};
   this.resetCallback = this.resetCallback.bind(this);
   this.verifyCallback = this.verifyCallback.bind(this);
   this._handleClick = this._handleClick.bind(this);
	  this.handleUserInput = this.handleUserInput.bind(this);
	  this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.resetForm = this.resetForm.bind(this);
	}
  // specifying your onload callback function
  resetCallback() {
    utils.logger('log', 'Reset Callback...');
  };

  verifyCallback(response) {
    this.state.recapcthaValid = response;
    this.state.formErrors.recapcthaValidErr = '';
  };

  componentDidMount() {
  	window.scrollTo(0,0);
    let apiConfig = config.getConfiguration();
  	this.setState({token : utils.getToken(), sitekey: apiConfig.CAPTCHA_SITE_KEY});
  }

  resetForm(){
    recaptchaInstance.reset();
    this.setState({
      first_name: '',
      last_name: '',
      email: '',
      subject: '',
      message: '',
      disableButton: false,
      recapcthaValid: ''
    });
  }

  _handleClick() {
       let fieldValidationErrors = this.state.formErrors;
        switch('first_name') {
          case 'first_name':
            if(!this.state.first_name){
              this.state.fnameValid = false;
              fieldValidationErrors.first_name = this.state.fnameValid ? '' : constant.ENTER_FIRST_NAME;
            }
          case 'last_name':
            if(!this.state.last_name){
              this.state.lnameValid = false;
              fieldValidationErrors.last_name = this.state.lnameValid ? '' : constant.ENTER_LAST_NAME;
            }
          case 'subject':
            if(!this.state.subject){
              this.state.subjectValid = false;
              fieldValidationErrors.subject = this.state.subjectValid ? '': constant.ENTER_SUBJECT;
            }
          case 'email':
            if(!this.state.email){
              this.state.emailValid = false;
              fieldValidationErrors.email = this.state.emailValid ? '' : constant.ENTER_EMAIL;
            }else if(!!this.state.email){
              this.state.emailValid = this.state.email.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
              fieldValidationErrors.email = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
            }
          case 'message':
            if(!this.state.message){
              this.state.messageValid = false;
              fieldValidationErrors.message = this.state.messageValid ? '': constant.ENTER_MESSAGE;
            }


            break;
          default:
            break;
        }

        this.setState({formErrors: fieldValidationErrors,
          fnameValid: this.state.fnameValid,
          lnameValid: this.state.lnameValid,
          emailValid: this.state.emailValid,
          subjectValid: this.state.subjectValid,
          messageValid: this.state.messageValid,
        }, this.validateForm);

          if (this.state.formValid ) {
            if (this.state.recapcthaValid) {
              const data = {};
              var _this = this;
              data.first_name = this.state.first_name.charAt(0).toUpperCase() + this.state.first_name.slice(1);
              data.last_name = this.state.last_name.charAt(0).toUpperCase() + this.state.last_name.slice(1);
              data.email = this.state.email.toLowerCase().trim();
              data.subject = this.state.subject;
              data.message = this.state.message;
              utils.apiCall('CONTACT_US', { 'data': data }, function(err, response) {
                if (err) {
                  utils.flashMsg('show', 'Error in Contact Us');
                  utils.logger('error', 'Contact Us Error -->', err);
                } else {
                  if (response.data.Code == 200 && response.data.Status == true) {
                    utils.flashMsg('show', constant.CONTACTUS_SUCCESS_MAIL_MESSAGE, 'success');
                    _this.resetForm();
                  } else {
                    utils.flashMsg('show', response.data.Message);
                  }
                }
              });
            } else {
              this.state.formErrors.recapcthaValidErr = constant.CHECKBOX_ERROR;
            }
          }
        }

    handleUserInput(e){
      this.setState({[e.target.name]: e.target.value});

    }

    handleInputOnBlur(e){
      this.setState({[e.target.name]: e.target.value});
      this.validateField(e.target.name, e.target.value);
    }

      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;

        switch(fieldName) {
          case 'first_name':
            if(value){
              if(value.length <= 50){
                this.state.fnameValid = value.match(/^[a-zA-Z -]+$/);
                fieldValidationErrors.first_name = this.state.fnameValid ? '' : constant.INVALID_FIRST_NAME_FORMAT;
              }else{
                this.state.fnameValid = false;
                fieldValidationErrors.first_name = this.state.fnameValid ? '' : constant.INVALID_FIRST_NAME_LENGTH;
              }
            }else{
              this.state.fnameValid = false;
              fieldValidationErrors.first_name = this.state.fnameValid ? '' : constant.ENTER_FIRST_NAME;
            }
            break;
          case 'last_name':
            if(value){
              if(value.length <= 50){
                this.state.lnameValid = value.match(/^[a-zA-Z -]+$/);
                fieldValidationErrors.last_name = this.state.lnameValid ? '' : constant.INVALID_LAST_NAME_FORMAT;
              }else{
                this.state.lnameValid = false;
                fieldValidationErrors.last_name = this.state.lnameValid ? '' : constant.INVALID_LAST_NAME_LENGTH;
              }
            }else{
              this.state.lnameValid = false;
              fieldValidationErrors.last_name = this.state.lnameValid ? '' : constant.ENTER_LAST_NAME;
            }
            break;
         case 'subject':
            if(value){
              if(value.length <= 50){
                this.state.subjectValid = true;
                fieldValidationErrors.subject = '' ;
              }else{
                this.state.subjectValid = false;
                fieldValidationErrors.subject = this.state.subjectValid ? '' : constant.INVALID_SUB_LENGTH;
              }
            }else{
              this.state.subjectValid = false;
              fieldValidationErrors.subject = this.state.subjectValid ? '' : constant.ENTER_SUBJECT;
            }
            break;
          case 'email':
            if(value){
              this.state.emailValid = value.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
              fieldValidationErrors.email = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
            }else{
              this.state.emailValid = false;
              fieldValidationErrors.email = this.state.emailValid ? '' : constant.ENTER_EMAIL;
            }
            break;
         case 'message':
            if(value){
              if(value.length <= 1000){
                this.state.messageValid = true;
                fieldValidationErrors.message = '' ;
              }else{
                this.state.messageValid = false;
                fieldValidationErrors.message = this.state.messageValid ? '' : constant.INVALID_MESSAGE_LENGTH;
              }
            }else{
              this.state.messageValid = false;
              fieldValidationErrors.message = this.state.messageValid ? '' : constant.ENTER_MESSAGE;
            }

            break;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        fnameValid: this.state.fnameValid,
                        lnameValid: this.state.lnameValid,
                        emailValid: this.state.emailValid,
                        subjectValid: this.state.subjectValid,
                        messageValid: this.state.messageValid,
                      }, this.validateForm);
      }

      validateForm() {
        this.setState({formValid: this.state.fnameValid && this.state.lnameValid && this.state.emailValid && this.state.subjectValid && this.state.messageValid });
      }

 render(){
    return (
    	<div className="bg-white">
        <div className="static-heading">
	        <h1>Support and Suggestions</h1>
	      </div>

	      <div className="content-wrapper container contact-panel">

	        <div className="contact-section">
	          <h1 className="subpage-heading text-center">Get in Touch!</h1>
	          <p>We want to hear from you. If you have questions, suggestions, or comments about Legably, please complete the following form and we’ll get back to you as soon as possible.</p>

	          <form className="contact-us-card card">
	            <div className="row">
	              <div className="col-sm-6">
	                <div className={this.state.formErrors.first_name !== '' ? 'form-group global-error' : 'form-group'}>
	                 <label className="control-label">First Name*</label>
	                  <input name="first_name" type="text" className="form-control" id="fname" placeholder="First Name" value={this.state.first_name} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
	                  <p><span>{this.state.formErrors.first_name !== '' ? this.state.formErrors.first_name : ''}</span></p>
	                </div>
	              </div>
	              <div className="col-sm-6">
	                <div className={this.state.formErrors.last_name !== '' ? 'form-group global-error' : 'form-group'}>
	                  <label className="control-label">Last Name*</label>
	                  <input type="text" className="form-control" name="last_name" id="lname" placeholder="Last Name" value={this.state.last_name} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
	                  <p><span>{this.state.formErrors.last_name !== '' ? this.state.formErrors.last_name : ''}</span></p>
	                </div>
	              </div>
	            </div>
	            <div className="row">
	              <div className="col-sm-6">
	                <div className={this.state.formErrors.subject !== '' ? 'form-group global-error' : 'form-group'}>
	                  <label className="control-label">Subject*</label>
	                  <input name="subject" className="form-control" placeholder="Subject" type="text" value={this.state.subject} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
	                  <p><span>{this.state.formErrors.subject !== '' ? this.state.formErrors.subject : ''}</span></p>
	                </div>
	              </div>
	              <div className="col-sm-6">
	                <div className={this.state.formErrors.email !== '' ? 'form-group global-error' : 'form-group'}>
	                  <label className="control-label">Email*</label>
	                  <input name="email" id="email" className="form-control" placeholder="Email" type="text" value={this.state.email} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
	                  <p><span>{this.state.formErrors.email !== '' ? this.state.formErrors.email : ''}</span></p>
	                </div>
	              </div>
	            </div>
	            <div className={this.state.formErrors.message !== '' ? 'form-group global-error' : 'form-group'}>
	              <label className="control-label">Your Message*</label>
	              <textarea name="message" className="form-control" placeholder="Your Message" value={this.state.message} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}></textarea>
	              <p><span>{this.state.formErrors.message !== '' ? this.state.formErrors.message : ''}</span></p>
	            </div>
	            <div className="row">
	              <div className="captcha-panel">
	                <div className={this.state.formErrors.recapcthaValidErr !== '' ? 'pl-15 captcha-sub global-error' : "captcha-sub pl-15"}>
	                {this.state.sitekey ? <Recaptcha
                     ref={e => recaptchaInstance = e}
	                   sitekey={this.state.sitekey}
	                   render="explicit"
	                   onloadCallback={this.resetCallback}
	                   verifyCallback={this.verifyCallback}
	                 /> : ''}
	                 <p><span>{this.state.formErrors.recapcthaValidErr !== '' ? this.state.formErrors.recapcthaValidErr : ''}</span></p>
	                </div>
	                <div className="pull-right">
	                  <button type="button" onClick={this._handleClick} className={this.state.disableButton ? "btn pull-right disabled-btn" : "btn pull-right"} disabled={this.state.disableButton}>Submit</button>
	                </div>
	              </div>

	            </div>
	            <div className="row">
	              <div className="contact-text">Contact Us at <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>support@legably.com</a> anytime for assistance or with questions.</div>
	            </div>
            </form>
          </div>
        </div>
        {!this.state.token && <LegablyLargeFooter />}
      </div>
    );
  }
}
