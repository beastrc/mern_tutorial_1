import React from 'react';
import { Link, browserHistory } from 'react-router';
var Recaptcha = require('react-recaptcha');

import { config, constant, helper, utils, cookieManager, sessionManager } from '../../../shared/index';
import ModalPopup from '../../shared/modal-popup/ModalPopup';

let recaptchaInstance;
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name : '',
      last_name : '',
      email: '',
      password: '',
      confirm_password: '',
      termCond : false,
      formErrors: {first_name: '', last_name: '', email: '', password: '', confirm_password:'', termCond: '',recapcthaValidErr:''},
      fnameValid: false,
      lnameValid: false,
      emailValid: false,
      passwordValid: false,
      cpasswordValid: false,
      termCondValid: false,
      formValid: false,
      recapcthaValid : '',
      recapcthaValidErr : false,
      stateList : [],
      showPass : false,
      showRePass: false,
      sitekey: '',
      modalPopupObj: {}
    };
    this._handleClick = this._handleClick.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.resetCallback = this.resetCallback.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.showRePassword = this.showRePassword.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0,0);
    let apiConfig = config.getConfiguration();
    this.setState({sitekey: apiConfig.CAPTCHA_SITE_KEY});
    browserHistory.listen(location => {
      if(location.state && location.state.email){
        this.setState({email : location.state.email.toString() , emailValid : true});
      }
    })
  }

  _handleClick(e) {
    e.preventDefault();
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
      case 'email':
        if(!this.state.email){
          this.state.emailValid = false;
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.ENTER_EMAIL;
        }else if(!!this.state.email){
          this.state.emailValid = this.state.email.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
        }
      case 'password':
        if(!this.state.password){
          this.state.passwordValid = false;
          fieldValidationErrors.password = this.state.passwordValid ? '': constant.ENTER_PASSWORD;
        }
      case 'confirm_password':
        if(!this.state.confirm_password){
          this.state.cpasswordValid = false;
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': constant.ENTER_RETYPE_PASS;
        }
        else if(this.state.password != this.state.confirm_password){
          this.state.cpasswordValid = false;
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': constant.PASS_NOT_MATCH;
        }
      case 'termCond':
        if(!this.state.termCond){
          this.state.termCondValid = false;
          fieldValidationErrors.termCond = this.state.termCondValid ? '': constant.TERM_SERV_ERROR;
        } else {
          this.state.termCondValid = true;
        }
        break;
      default:
        break;
    }

    this.setState({formErrors: fieldValidationErrors,
      fnameValid: this.state.fnameValid,
      lnameValid: this.state.lnameValid,
      emailValid: this.state.emailValid,
      passwordValid: this.state.passwordValid,
      cpasswordValid: this.state.cpasswordValid,
      termCondValid: this.state.termCondValid,
    }, this.validateForm);

    if(this.state.formValid ) {
      if(this.state.recapcthaValid) {
        if(this.state.termCond) {
          var _this = this;
          const data = {
            first_name: _this.state.first_name.charAt(0).toUpperCase() + _this.state.first_name.slice(1),
            last_name: _this.state.last_name.charAt(0).toUpperCase() + _this.state.last_name.slice(1),
            email: _this.state.email.toLowerCase().trim(),
            password: _this.state.password,
            confirm_password: _this.state.confirm_password
          };

          utils.apiCall('SIGN_UP', { 'data': data }, function(err, response) {
            if (err) {
              utils.flashMsg('show', 'Error in Sign Up');
              utils.logger('error', 'Sign Up Error -->', err);
            } else {
              if (utils.isResSuccess(response)) {
                _this.state.recapcthaValid = '';
                helper.openEmailVerificationRequiredPopup(_this, 'SIGN_UP_EMAIL_VERIFICATION_REQUIRED', data.email);
                _this.resetForm();
              } else if (response['data']['code'] === constant['HTTP_STATUS_CODES']['IM_USED']) {
                _this.state.emailValid = false;
                _this.state.formErrors.email = constant.EMAIL_ALREADY_EXIST;
                _this.validateForm();
                _this.state.formErrors.recapcthaValidErr = '';
              } else {
                utils.flashMsg('show', utils.getServerErrorMsg(response));
              }
            }
          });
        } else {
          this.state.termCondValid = false;
          this.state.formErrors.termCond  = constant.TERM_SERV_ERROR;
        }
      } else {
        this.state.formErrors.recapcthaValidErr = constant.CHECKBOX_ERROR;
      }
    }
  }

  handleUserInput(e){
    this.setState({[e.target.name]: e.target.value});
     let that = this.state;
    let fieldError = this.state.formErrors;
  }

  handleInputChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      [e.target.name]: value
    });

    this.validateField(e.target.name, e.target.value);
  }


  showPassword() {
    if(this.state.showPass){
      document.getElementById("pwd").setAttribute("type", "password");
      this.setState({
        showPass: false
      });
    }else{
      document.getElementById("pwd").setAttribute("type", "text");
      this.setState({
        showPass: true
      });
    }
  }

  showRePassword() {
    if(this.state.showRePass){
      document.getElementById("repwd").setAttribute("type", "password");
      this.setState({
        showRePass: false
      });
    }else{
      document.getElementById("repwd").setAttribute("type", "text");
      this.setState({
        showRePass: true
      });
    }
  }

  handleInputOnBlur(e) {
    this.setState({[e.target.name]: e.target.value});
    let that = this.state;
    let fieldError = this.state.formErrors;
    this.validateField(e.target.name, e.target.value);
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;

    switch(fieldName) {
      case 'first_name':
        if (value) {
          if (value.length <= 50) {
            this.state.fnameValid = value.match(/^[a-zA-Z -]+$/);
            fieldValidationErrors.first_name = this.state.fnameValid ? '' : constant.INVALID_FIRST_NAME_FORMAT;
          } else {
            this.state.fnameValid = false;
            fieldValidationErrors.first_name = this.state.fnameValid ? '' : constant.INVALID_FIRST_NAME_LENGTH;
          }
        } else {
          this.state.fnameValid = false;
          fieldValidationErrors.first_name = this.state.fnameValid ? '' : constant.ENTER_FIRST_NAME;
        }
        break;
      case 'last_name':
        if (value) {
          if (value.length <= 50) {
            this.state.lnameValid = value.match(/^[a-zA-Z -]+$/);
            fieldValidationErrors.last_name = this.state.lnameValid ? '' : constant.INVALID_LAST_NAME_FORMAT;
          } else {
            this.state.lnameValid = false;
            fieldValidationErrors.last_name = this.state.lnameValid ? '' : constant.INVALID_LAST_NAME_LENGTH;
          }
        } else {
          this.state.lnameValid = false;
          fieldValidationErrors.last_name = this.state.lnameValid ? '' : constant.ENTER_LAST_NAME;
        }
        break;
      case 'email':
        if (value) {
          this.state.emailValid = value.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
        } else {
          this.state.emailValid = false;
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.ENTER_EMAIL;
        }
        break;
      case 'password':
        if (value) {
          if (value.length >= 8) {
            const PASSWORD_REGEXP = /^(?=.{8,})(?=.*[a-zA-Z0-9!@#$%^&*()]).*$/;
            if (PASSWORD_REGEXP.test(value)) {
              var count = 1, counter = 1;
              for (var i = 0; i < value.length; i++) {
                if (value[i] == value[i+1]) {
                  count++;
                } else {
                  if (Math.abs(value.charCodeAt(i+1) - value.charCodeAt(i)) === 1) {
                    counter++;
                  } else {
                    this.state.passwordValid = true;
                    fieldValidationErrors.password = '';
                  }
                }

                if (count == value.length) {
                  this.state.passwordValid = false;
                  fieldValidationErrors.password = this.state.passwordValid ? '': constant.INVALID_SINGLE_CHAR_PASS;
                } else if(counter == value.length) {
                  this.state.passwordValid = false;
                  fieldValidationErrors.password = this.state.passwordValid ? '': constant.INVALID_CONSECUTIVE_PASS;
                }
              }
            } else {
              this.state.passwordValid = false;
              fieldValidationErrors.password = this.state.passwordValid ? '': constant.INVALID_PASS_LENGTH;
            }
          } else {
            this.state.passwordValid = false;
            fieldValidationErrors.password = this.state.passwordValid ? '': constant.INVALID_PASS_LENGTH;
          }
        } else {
          this.state.passwordValid = false;
          fieldValidationErrors.password = this.state.passwordValid ? '': constant.ENTER_PASSWORD;
        }
        break;
      case 'confirm_password':
        if (value) {
          this.state.cpasswordValid = (value == this.state.password ? true : false);
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': constant.PASS_NOT_MATCH;
        } else {
          this.state.cpasswordValid = false;
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': constant.ENTER_RETYPE_PASS;
        }
        break;
      case 'termCond':
        if (this.state.termCond) {
          this.state.termCondValid = false;
          fieldValidationErrors.termCond = constant.TERM_SERV_ERROR ;
        } else {
          this.state.termCondValid = true;
          fieldValidationErrors.termCond = '' ;
        }
        break;
      default:
        break;
    }

    this.setState({formErrors: fieldValidationErrors,
      fnameValid: this.state.fnameValid,
      lnameValid: this.state.lnameValid,
      emailValid: this.state.emailValid,
      passwordValid: this.state.passwordValid,
      cpasswordValid: this.state.cpasswordValid,
      termCondValid: this.state.termCondValid
    }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.fnameValid && this.state.lnameValid && this.state.emailValid && this.state.passwordValid && this.state.cpasswordValid && this.state.termCondValid});
  }

  resetCallback() {
    utils.logger('log', 'Reset Callback...');
  };

  verifyCallback(response) {
    this.state.recapcthaValid = response;
    this.state.formErrors.recapcthaValidErr = '';
  };

  resetForm() {
    recaptchaInstance.reset();
    this.setState({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      termCond : false,
      recapcthaValid: ''
    });
  }

  render() {
    return (
      <div className="sign-up-page-wrapper">
        <section className="right-section sign-up-section pull-right">
          <div className="white-logo-bg">
            <img onClick={() => utils.goToHome()} src={constant['IMG_PATH'] + 'primaryHorizontalRgb@2x.jpg'} alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31"/>
          </div>
          <div className="form-wrapper">
            <h4>Sign Up for Legably</h4>
            <form className="sign-up-form mb-30" onSubmit={this._handleClick}>
              <div className={this.state.formErrors.first_name !== '' ? 'form-group global-error' : 'form-group'}>
                <label htmlFor="fname">first name*</label>
                <input name="first_name" type="text" className="form-control" id="fname" placeholder="First Name" value={this.state.first_name} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                <p><span>{this.state.formErrors.first_name !== '' ? this.state.formErrors.first_name : ''}</span></p>
              </div>
              <div className={this.state.formErrors.last_name !== '' ? 'form-group global-error' : 'form-group'}>
                <label htmlFor="lname">last name*</label>
                <input type="text" className="form-control" name="last_name" id="lname" placeholder="Last Name" value={this.state.last_name} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                <p><span>{this.state.formErrors.last_name !== '' ? this.state.formErrors.last_name : ''}</span></p>
              </div>
              <div className={this.state.formErrors.email !== '' ? 'form-group global-error' : 'form-group'}>
                <label htmlFor="email">Email* </label>
                <input type="text" className="form-control email-id" name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}  />
                <p><span>{this.state.formErrors.email !== '' ? this.state.formErrors.email : ''}</span></p>
              </div>
              <div className={this.state.formErrors.password !== '' ? 'form-group global-error' : 'form-group'}>
                <label htmlFor="pwd">Password*</label>
                <div className="pwd-wrapper">
                  <input type="password" id="pwd" className="pswd form-control" name="password" placeholder="Password" value={this.state.password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                  <span onClick={this.showPassword} className="eye"><i className={this.state.showPass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                </div>
                <p><span>{this.state.formErrors.password !== '' ? this.state.formErrors.password : ''}</span></p>
              </div>
              <div className={this.state.formErrors.confirm_password !== '' ? 'form-group global-error' : 'form-group'}>
                <label htmlFor="repwd">Retype Password* </label>
                <div className="pwd-wrapper">
                  <input type="password" className="pswd form-control" id="repwd" name="confirm_password" placeholder="Retype Password" value={this.state.confirm_password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}/>
                  <span onClick={this.showRePassword} className="eye"><i className={this.state.showRePass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                </div>
                <p><span>{this.state.formErrors.confirm_password !== '' ? this.state.formErrors.confirm_password : ''}</span></p>
              </div>
              <div className={this.state.formErrors.recapcthaValidErr !== '' ? 'form-group checkbox global-error responive-captcha' : 'form-group checkbox responive-captcha'} >
                {this.state.sitekey ? <Recaptcha ref={e => recaptchaInstance = e} sitekey={this.state.sitekey} render="explicit" verifyCallback={this.verifyCallback} onloadCallback={this.resetCallback} /> : ''}
                <p><span>{this.state.formErrors.recapcthaValidErr !== '' ? this.state.formErrors.recapcthaValidErr : ''}</span></p>
              </div>
              <div className={this.state.formErrors.termCond !== '' ? 'form-group checkbox global-error' : 'form-group checkbox'}>
                <label className="pmd-checkbox">
                  <input name="termCond" type="checkbox" checked={this.state.termCond} onChange={this.handleInputChange}/><span className="pmd-checkbox-label">&nbsp;</span>By clicking <q>Sign Up</q> I agree to Legably's Terms of Service
                </label>
                <p><span>{this.state.formErrors.termCond !== '' ? this.state.formErrors.termCond : ''}</span></p>
              </div>
              <div className="btns">
                <button type="submit" className="btn sign-up-btn">Sign up</button>
              </div>
            </form>
            <div className="already-signed">Already have an account? <Link to={constant['ROUTES_PATH']['SIGN_IN']}>Sign In</Link></div>
          </div>
        </section>
        <section className="clearfix"></section>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div>
    );
  }
}
