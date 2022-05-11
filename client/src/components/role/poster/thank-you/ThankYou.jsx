import React from 'react';
import { Link } from 'react-router';

import { Role } from '../../../index';
import { constant, utils } from '../../../../shared/index';

export default class ThankYou extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <Role step="thank_you" role="poster" profileStatus={1}>
        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={() => utils.changeUrl(routesPath['POSTER_BASIC_INFO'])}></span> Thank You!</div>
        <div className="get-started-form form">
          <div className="get-started-card card">
            <h5 className="mb-40">Thank you for creating your firm profile on Legably!</h5>
            <div className="row mb-35 v-center">
              <div className="col-sm-2 text-center">
                <button className="yellow-btn" type="button">Post a Job</button>
              </div>
              <div className="col-sm-10">
                <p>Ready to take the next step toward finding the flexible legal talent you need to grow your practice? Click <Link to={routesPath['POST_JOB']} className="click-here">here</Link> to post a job and get started!</p>
              </div>
            </div>
            <div className="row mb-35 v-center">
              <div className="col-sm-2 text-center">
                <span className="icon-msg-icon"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
              </div>
              <div className="col-sm-10">
                <p>Click <Link to={routesPath['MY_POSTED_JOBS']} className="click-here">here</Link> to manage your job postings and hiring processes, explore candidates, and complete the hiring process-all online, all on the Legably dashboard.</p>
              </div>
            </div>
            <div className="row mb-35 v-center">
              <div className="col-sm-2 text-center">
                <span className="icon-contact-icon"><span className="path1"></span><span className="path2"></span></span>
              </div>
              <div className="col-sm-10">
                <p>Questions or suggestions? Click <Link to={routesPath['SUPPORT_CENTER']} className="click-here">here</Link> to get in touch with the Legably team!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="nxt-prev-btns">
          <button type="click" onClick={() => utils.changeUrl(routesPath['POSTER_BASIC_INFO'])} className="previouse-btn btn pull-left mb-10">Previous</button >
          <span className="clear-fix"></span>
        </div>
      </Role>
    );
  }
}
