import React from 'react';
import { Link, browserHistory } from 'react-router';

import { constant, utils } from '../../../shared/index';

export default class ForgotPassword extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      formErrors: { email: '' },
      emailValid: false,
      hideThankYou: true
    };
    this._handleClick = this._handleClick.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
  }

  _handleClick (e) {
    e.preventDefault();
    let fieldValidationErrors = this.state.formErrors;
    if(!this.state.email){
      this.state.emailValid = false;
      fieldValidationErrors.email = this.state.emailValid ? '' : constant.ENTER_EMAIL;
    }else if(!!this.state.email){
      this.state.emailValid = this.state.email.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
      fieldValidationErrors.email = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
    }
    else{
      this.state.emailValid = true;
    }

    this.setState({formErrors: fieldValidationErrors,
      emailValid: this.state.emailValid,
    }, this.validateForm);

    if (this.state.emailValid) {
      const data = {};
      var _this = this;
      data.email = this.state.email.toLowerCase().trim();
      utils.apiCall('FORGOT_PASSWORD', { 'data': data }, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while performing Forgot Password action');
          utils.logger('error', 'Forgot Password Error -->', err);
        } else {
          if (response.data.Code == 200 && response.data.Status == true) {
            _this.setState({hideThankYou: false});
          } else {
            _this.state.emailValid = false;
            _this.state.formErrors.email = response.data.Message;
            _this.validateForm();
            utils.logger('warn', 'Forgot Password -->', response.data.Message);
          }
        }
      })
    }
  }

  handleInputOnBlur(e){
    this.validateField(e.target.name, e.target.value);
  }

  handleUserInput(e){
    this.setState({[e.target.name]: e.target.value});
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;

    switch(fieldName) {
      case 'email':
        if (value) {
          this.state.emailValid = value.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
        } else {
          this.state.emailValid = false;
          fieldValidationErrors.email = this.state.emailValid ? '' : constant.ENTER_EMAIL;
        }
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      emailValid: emailValid
    }, this.validateForm);
  }

  validateForm() {
    this.setState({emailValid: this.state.emailValid});
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <div className="forgot-pwd-page-wrapper">
        { this.state.hideThankYou ? ( <section className="right-section forgot-pwd-section pull-right">
          <div className="white-logo-bg">
            <img onClick={() => utils.goToHome()} src={constant['IMG_PATH'] + 'primaryHorizontalRgb@2x.jpg'} alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" />
          </div>
          <div className="form-wrapper">
            <h4>Request Password Reset</h4>
            <p className="mb-30">Please provide your registered email address to aid in the password recovery process.</p>
            <form className="forgot-pwd-form" onSubmit={this._handleClick} >
              <div className={this.state.formErrors.email !== '' ? 'form-group global-error' : 'form-group'}>
                <label htmlFor="email">Email* </label>
                <input type="text" className="form-control email-id" name="email"
                  placeholder="Enter your email"
                  value={this.state.email}
                  onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}  />
                <p><span>{this.state.formErrors.email !== '' ? this.state.formErrors.email : ''}</span></p>
              </div>
              <div className="btns">
                <button type="submit" className="btn sign-in-btn">Submit</button>
              </div>
            </form>
            <Link to={routesPath['SIGN_IN']} className="already-signed">Back to Sign In</Link>
          </div>
        </section> ) : ( <div className="reset-link-page-wrapper">
          <section className="right-section reset-link-section pull-right">
            <div className="white-logo-bg"><img onClick={() => utils.goToHome()} src={constant['IMG_PATH'] + 'primaryHorizontalRgb@2x.jpg'} alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" /></div>
            <div className="form-wrapper">
              <img src={constant['IMG_PATH'] + 'reset-link.png'} alt="reset-link" className="img-responsive" />
              <h5>An email has been sent to <b>{this.state.email}</b>. Please click on the link provided in the mail to reset your password.</h5>
              <p>In case you do not receive your password reset email shortly, please check your spam folder.</p>
              <div className="btns">
                <button type="submit" onClick={() => utils.changeUrl(routesPath['SIGN_IN'])} className="btn reset-link-btn">Continue to Sign In</button>
              </div>
            </div>
          </section>
        </div> )}
        <section className="clearfix"></section>
      </div>
    );
  }
}
