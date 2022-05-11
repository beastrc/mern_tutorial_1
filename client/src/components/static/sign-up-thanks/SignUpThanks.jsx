import React from 'react';

import { constant, utils, cookieManager } from '../../../shared/index';

export default class SignUpThanks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.changeUrl = this.changeUrl.bind(this);
  }

  changeUrl(){
    if (cookieManager.get('redirectionPage')) {
      utils.redirectionHandle();
    } else {
      utils.changeUrl(constant['ROUTES_PATH']['SEEKER_BASIC_INFO']);
    }
  }

  render() {
    return (
    	<div>
        <div className="thank-you-container content-wrapper container">
          <div className="thank-you-form form">
            <div className="thank-you-card card">
              <img src={constant['IMG_PATH'] + 'thank-u.png'} alt="Thank You" className="img-responsive" />
              <h4>Thanks!</h4>
              <p>Now that you have verified your email address please click below to get started creating your Legably profile.</p>
              <button className="btn" onClick={() => this.changeUrl()}>Get Started</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
