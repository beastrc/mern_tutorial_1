import React from 'react';
import { Link } from 'react-router';

import { constant, sessionManager, utils } from '../../../shared/index';

export default class VerifyEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailVerified: true
    };
  }

  componentDidMount() {
    if (sessionManager.isSession()) {
      alert(constant['POPUP_MSG']['VERIFY_EMAIL']);
      window.close();
      return;
    } else {
      var _this = this;
      utils.apiCall('VERIFY_EMAIL', { 'params': [_this.props.params.secretId] }, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while verifying Email');
          utils.logger('error', 'Verify Email Error -->', err);
        } else {
          if (utils.isResSuccess(response)) {
            sessionManager.create(utils.getDataFromRes(response));
            utils.changeUrl(constant['ROUTES_PATH']['THANKS']);
          } else {
            _this.setState({emailVerified : false});
            utils.logger('warn', 'Verify Email -->', utils.getServerErrorMsg(response));
          }
        }
      });
    }
  }

  render() {
    return (
      this.state.emailVerified ?
        null
      :
        <div className="user-login-wrapper">
          <section className="left-banner pull-left forgot-pwd-banner reset-link-banner">
            <div>
              <img onClick={() => utils.goToHome()} src={constant['IMG_PATH'] + 'logo-white@2x.png'} alt="leably-white-logo" className="img-responsive logo" width="180" height="47" />
              <h3>Find the best legal job</h3>
              <h3>Hire the best attorney</h3>
              <p>Legably is the modern online legal staffing platform that connects attorneys seeking work with other attorneys and firms in need of their services.</p>
            </div>
          </section>

          {/*<section className="right-section sign-in-section pull-right">
            <h5>Invalid Link or Link has been expired</h5>
          </section>*/}
          <div className="verify-email-page-wrapper">
            <div className="reset-link-page-wrapper">
              <section className="right-section reset-link-section pull-right">
                <div className="white-logo-bg">
                  <img src="/images/primaryHorizontalRgb@2x.jpg" alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" />
                </div>
                <div className="form-wrapper">
                  <h5>Invalid Link or Link has been expired</h5>
                  <div className="btns">
                    <button type="button" className="btn reset-link-btn" onClick={() => utils.changeUrl(constant['ROUTES_PATH']['SIGN_IN'])}>Continue to Sign In</button>
                  </div>
                </div>
              </section>
            </div>
            <section className="clearfix"></section>
          </div>
        </div>
    )
  }
}
