import React from 'react';
import { Link, browserHistory} from 'react-router';

import { constant, helper, utils, cookieManager, sessionManager } from '../../../shared/index';
import ModalPopup from '../../shared/modal-popup/ModalPopup';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememeberMe : false,
      formErrors: {email: '', password: ''},
      emailValid: false,
      passwordValid: false,
      formValid: false,
      showPass : false,
      modalPopupObj: {}
    };
    this._handleClick = this._handleClick.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.showPassword = this.showPassword.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0,0);
    if(cookieManager.get('rememeberMe')){
      let userData = {};
      userData = cookieManager.getObject('rememeberMe');
      userData.password = atob(userData.password);
      this.setState({rememeberMe : true , email : userData.email.toString() , password : userData.password.toString()});
      this.validateField('email', userData.email);
      this.validateField('password', userData.password);
    }
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

 _handleClick(e) {
    e.preventDefault();
    let fieldValidationErrors = this.state.formErrors;
    switch('email') {
      case 'email':
        if(!this.state.email){
          this.state.emailValid = false;
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.ENTER_EMAIL;
        }
      case 'password':
        if(!!this.state.password){
          this.state.passwordValid = true;
          fieldValidationErrors.password = '';
        }else{
          this.state.passwordValid = false;
          fieldValidationErrors.password = this.state.passwordValid ? '': constant.ENTER_PASSWORD;
        }
        break;
      default:
        break;
    }

    this.setState({formErrors: fieldValidationErrors,
      emailValid: this.state.emailValid,
      passwordValid: this.state.passwordValid,
    }, this.validateForm);

    if(this.state.emailValid && this.state.passwordValid){
      var _this = this;
      const data = {
        email: _this.state.email.toLowerCase().trim(),
        password: _this.state.password
      };

      utils.apiCall('SIGN_IN', { 'data': data }, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error in Sign In');
          utils.logger('error', 'Sign In Error -->', err);
        } else {
          if (utils.isResSuccess(response)) {
            if (_this.state.rememeberMe) {
              cookieManager.setObject('rememeberMe', {email: data.email, password: btoa(_this.state.password)});
            } else {
              cookieManager.clear('rememeberMe');
            }
            sessionManager.create(utils.getDataFromRes(response));
            utils.redirectionHandle();
          } else if (utils.isResLocked(response)) {
            helper.openEmailVerificationRequiredPopup(_this, 'SIGN_IN_EMAIL_VERIFICATION_REQUIRED', data.email);
            document.getElementById("pwd").blur();
            _this.resetForm();
          } else {
            utils.flashMsg('show', utils.getServerErrorMsg(response));
          }
        }
      });
    }
  }

  resetForm() {
    this.setState({
      email: '',
      password: '',
      rememeberMe : false
    });
  }

  handleUserInput(e){
    this.setState({[e.target.name]: e.target.value});
  }

  handleInputChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.setState({
      [e.target.name]: value
    });
  }

  handleInputOnBlur(e){
    this.setState({[e.target.name]: e.target.value});
    this.validateField(e.target.name, e.target.value);
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let userData = this.state.userData;

    switch(fieldName) {
      case 'email':
        if(value){
          this.state.emailValid = value.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
        }else{
          this.state.emailValid = false;
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.ENTER_EMAIL;
        }
        break;
      case 'password':
        if(!value){
          this.state.passwordValid = false;
          fieldValidationErrors.password = this.state.passwordValid ? '': constant.ENTER_PASSWORD;
        }else{
          this.state.passwordValid = true;
          fieldValidationErrors.password = '';
        }
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
      emailValid: this.state.emailValid,
      passwordValid: this.state.passwordValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.passwordValid});
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <div className="sign-in-page-wrapper">
        <section className="right-section sign-in-section pull-right">
          <div className="white-logo-bg">
            <img onClick={() => utils.goToHome()}
             src={constant['IMG_PATH'] + 'primaryHorizontalRgb@2x.jpg'} alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" />
          </div>
          <div className="form-wrapper">
            <h4>Sign In to Legably</h4>
            <form className="sign-in-form" onSubmit={this._handleClick}>
              <div className={this.state.formErrors.email !== '' ? 'form-group global-error' : 'form-group'}>
                <label htmlFor="email">Email* </label>
                <input type="text" className="form-control email-id" name="email"
                  placeholder="Enter your email"
                  value={this.state.email}
                  onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                <p><span>{this.state.formErrors.email !== '' ? this.state.formErrors.email : ''}</span></p>
              </div>
              <div className={this.state.formErrors.password !== '' ? 'form-group global-error' : 'form-group'}>
                <label htmlFor="pwd">Password*</label>
                <div className="pwd-wrapper">
                  <input type="password" id="pwd" className="pswd form-control" name="password" placeholder="Enter your password" value={this.state.password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                  <span onClick={this.showPassword} className="eye"><i className={this.state.showPass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                </div>
                <p><span>{this.state.formErrors.password !== '' ? this.state.formErrors.password : ''}</span></p>
              </div>
              <div className="form-group checkbox mb-35">
                <label className="pmd-checkbox">
                  <input type="checkbox" name="rememeberMe" checked={this.state.rememeberMe} onChange={this.handleInputChange}/><span className="pmd-checkbox-label">&nbsp;</span>Remember me
                </label>
                <Link to={routesPath['FORGOT_PASSWORD']}>Forgot Password </Link>
              </div>
              <div className="btns">
                <button type="submit" className="btn sign-in-btn">Sign In</button>
              </div>
            </form>
            <div className="already-signed">Don’t have an account? <Link to={routesPath['SIGN_UP']}>Sign Up</Link></div>
          </div>
        </section>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div>
    );
  }
}
