import React from 'react';

import { constant, utils } from '../../shared/index';

export default class User extends React.Component {
  render() {
    return (
      <div className="user-login-wrapper">
        <section className="left-banner pull-left forgot-pwd-banner reset-link-banner">
          <div>
            <img onClick={() => utils.goToHome()} src={constant['IMG_PATH'] + 'logo-white@2x.png'} alt="leably-white-logo" className="img-responsive logo" width="180" height="47" />
            <h3>Find the best legal job</h3>
            <h3>Hire the best attorney</h3>
            <p>Legably is the modern online legal staffing platform that connects attorneys seeking work with other attorneys and firms in need of their services.</p>
          </div>
        </section>

        {this.props.children}

        <section className="clearfix"></section>
      </div>
    );
  }
}
