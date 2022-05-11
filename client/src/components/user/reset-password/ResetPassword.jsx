import React from 'react';
import { Link } from 'react-router';

import { constant, utils } from '../../../shared/index';

export default class ResetPassword extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      validLink: true,
      password: '',
      confirm_password : '',
      formErrors: { password: '',confirm_password: '' },
      passwordValid: false,
      cpasswordValid: false,
      formValid: false,
      showPass: false,
      showRePass: false,
      showSuccess: false
    };
    this._handleClick = this._handleClick.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.showPassword = this.showPassword.bind(this);
  }

  componentDidMount() {
    var _this = this;
    utils.apiCall('CHECK_RESET_PASSWORD_LINK', { 'params': [this.props.params.secretId] }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while checking Reset Password Link');
        utils.logger('error', 'Check Reset Password Link Error -->', err);
      } else {
        if (response.data.Code == 200 && response.data.Status == true) {
          _this.setState({validLink : true});
        } else {
          _this.setState({validLink : false});
          utils.logger('warn', 'Check Reset Password Link -->', response.data.Message);
        }
      }
    });
  }

  showPassword(id, from, fromState) {
    if(fromState){
      document.getElementById(id).setAttribute("type", "password");
      this.setState({
        [from]: false
      });
    }else{
      document.getElementById(id).setAttribute("type", "text");
      this.setState({
        [from]: true
      });
    }
  }

  _handleClick(e) {
    e.preventDefault();
    let fieldValidationErrors = this.state.formErrors;
    switch('password') {
      case 'password':
        if (!this.state.password) {
          this.state.passwordValid = false;
          fieldValidationErrors.password = this.state.passwordValid ? '': constant.ENTER_NEW_PASS;
        }
      case 'confirm_password':
        if (!this.state.confirm_password) {
          this.state.cpasswordValid = false;
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': constant.ENTER_NEW_RETYPE_PASS;
        } else if (this.state.password != this.state.confirm_password) {
          this.state.cpasswordValid = false;
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': constant.PASS_NOT_MATCH;
        }
        break;
      default:
        break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      passwordValid: this.state.passwordValid,
      cpasswordValid: this.state.cpasswordValid,
    }, this.validateForm);

    if (this.state.formValid && (this.state.password == this.state.confirm_password)) {
      const data = {};
      var _this = this;
      data.password = this.state.password;
      data.confirm_password = this.state.confirm_password;
      utils.apiCall('RESET_PASSWORD', { 'params': [this.props.params.secretId], 'data': data }, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while resetting Password');
          utils.logger('error', 'Reset Password Error -->', err);
        } else {
          if (response.data.Code == 200 && response.data.Status == true) {
            _this.setState({showSuccess: true});
          } else {
            utils.flashMsg('show', response.data.Message);
          }
        }
      });
    }
  }

  handleInputOnBlur(e) {
    this.setState({[e.target.name]: e.target.value});
    this.validateField(e.target.name, e.target.value);
  }

  handleUserInput(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;

    switch(fieldName) {
      case 'password':
        if (value) {
          if (value.length >= 8) {
            const PASSWORD_REGEXP = /^(?=.{8,})(?=.*[a-zA-Z0-9!@#$%^&*()]).*$/;
            if (PASSWORD_REGEXP.test(value)) {
              var count = 1, counter = 1;
              for(var i = 0; i < value.length; i++) {
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
                } else if (counter == value.length) {
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
          fieldValidationErrors.password = this.state.passwordValid ? '': constant.ENTER_NEW_PASS;
        }
        break;
      case 'confirm_password':
        if (value) {
          this.state.cpasswordValid = (value == this.state.password ? true : false);
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': constant.PASS_NOT_MATCH;
        } else {
          this.state.cpasswordValid = false;
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': constant.ENTER_NEW_RETYPE_PASS;
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      passwordValid: this.state.passwordValid,
      cpasswordValid: this.state.cpasswordValid,
    }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.passwordValid && this.state.cpasswordValid});
  }

  render(){
    let routesPath = constant['ROUTES_PATH'];

    return (
      <div className="reset-pwd-page-wrapper">
        { this.state.validLink ? ( this.state.showSuccess ? ( <div className = "reset-link-page-wrapper">
          <section className="right-section reset-link-section pull-right">
            <img onClick={() => utils.goToHome()} src={constant['IMG_PATH'] + 'primaryHorizontalRgb@2x.jpg'} alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" />
            <div className="form-wrapper">
              <img src={constant['IMG_PATH'] + 'thank-u.png'} alt="Thank You" className="img-responsive" />
              <h5>Thanks! You have successfully reset your password</h5>
              <div className="btns">
                <button type="submit" className="btn reset-link-btn" onClick={() => utils.changeUrl(routesPath['SIGN_IN'])}>Sign In</button>
              </div>
            </div>
          </section>
        </div> ) : ( <div className = "forgot-pwd-page-wrapper" >
          <section className="right-section forgot-pwd-section pull-right">
            <div className="white-logo-bg"><img onClick={() => Util.goToHome()} src={constant['IMG_PATH'] + 'primaryHorizontalRgb@2x.jpg'} alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" /></div>
            <div className="form-wrapper">
              <h4>Reset Password</h4>
              <p className="mb-30">It’s a good idea to use a strong password that you don’t use elsewhere.</p>
              <form className="forgot-pwd-form" onSubmit={this._handleClick}>
                <div className={this.state.formErrors.password !== '' ? 'form-group global-error' : 'form-group'}>
                  <label htmlFor="new-pwd">New Password</label>
                  <div className="pwd-wrapper">
                    <input type="password" className="pswd form-control" id="new-pwd" placeholder="New Password" name="password" value={this.state.password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}/>
                    <span onClick={() => this.showPassword("new-pwd", "showPass", this.state.showPass)} className="eye"><i className={this.state.showPass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                  </div>
                  <p><span>{this.state.formErrors.password !== '' ? this.state.formErrors.password : ''}</span></p>
                </div>
                <div className={this.state.formErrors.confirm_password !== '' ? 'form-group global-error' : 'form-group'}>
                  <label htmlFor="re-pwd">Retype New Password</label>
                  <div className="pwd-wrapper">
                    <input type="password" className="pswd form-control" id="re-pwd" placeholder="Retype New Password" name="confirm_password" value={this.state.confirm_password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}/>
                    <span className="eye"><i className="fa fa-eye"></i></span>
                    <span onClick={() => this.showPassword("re-pwd", "showRePass", this.state.showRePass)} className="eye"><i className={this.state.showRePass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                  </div>
                  <p><span>{this.state.formErrors.confirm_password !== '' ? this.state.formErrors.confirm_password : ''}</span></p>
                </div>

                <div className="btns">
                  <button type="submit" className="btn btn-primary sign-in-btn">Submit</button>
                </div>
              </form>
              <Link to={routesPath['SIGN_IN']} className="already-signed">Back to Sign In</Link>
            </div>
          </section>
        </div> ) ) : ( <div className = "reset-link-page-wrapper">
          <section className="right-section reset-link-section pull-right">
            <div className="white-logo-bg"><img onClick={() => utils.goToHome()} src={constant['IMG_PATH'] + 'primaryHorizontalRgb@2x.jpg'} alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" /></div>
            <div className="form-wrapper">
              <img src={constant['IMG_PATH'] + 'reset-link.png'} alt="reset-link" className="img-responsive" />
              <h5>Invalid Link or Link has been expired</h5>
              <div className="btns">
                <button onClick={() => utils.changeUrl(routesPath['SIGN_IN'])} className="btn reset-link-btn">Continue to Sign In</button>
              </div>
            </div>
          </section>
        </div> ) }
        <section className="clearfix"></section>
      </div>
    )
  }
}
