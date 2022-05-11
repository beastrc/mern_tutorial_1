import React from 'react';
import { Link } from 'react-router';

import { Role } from '../../../index';
import { constant, utils } from '../../../../shared/index';

class GetStarted extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      openIncompleteProfilePopup: false
    };
    this.routesPath = constant['ROUTES_PATH'];
    this.moveToPostAJobSection = this.moveToPostAJobSection.bind(this);
  }

  moveToPostAJobSection(evt) {
    evt.preventDefault();
    let userData = utils.getCurrentUser();
    if (userData && userData.is_poster_profile_completed) {
      utils.changeUrl(this.routesPath['POST_JOB']);
    } else {
      this.setState({
        openIncompleteProfilePopup: true
      });
    }
  }

  render() {
    return (
      <Role step="get_started" role="seeker" profileStatus={4} openIncompleteProfilePopup={this.state.openIncompleteProfilePopup}>
        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={() => utils.changeUrl(this.routesPath['SEEKER_JOB_TYPE'])}></span> Get Started!</div>
        <div className="get-started-form form">
          <div className="get-started-card card">
            <h5 className="mb-40">Thank you for creating your attorney profile on Legably!</h5>
            <div className="row mb-35 v-center">
              <div className="col-sm-2 text-center">
                <span className="icon-msg-icon"><span className="path1"></span><span className="path2"></span><span className="path3"></span></span>
              </div>
              <div className="col-sm-10">
                <p>Next, click <Link to={this.routesPath['JOB_SEARCH']} className="click-here">here</Link> to explore and apply for opportunities on Legably, manage your job search, and earn more-all online, all on the Legably dashboard.</p>
              </div>
            </div>
            <div className="row mb-35 v-center">
              <div className="col-sm-2 text-center">
                <button className="yellow-btn" type="button">Post a Job</button>
              </div>
              <div className="col-sm-10">
                <p>Short staffed? Click <Link to="javascript:void(0)" className="click-here" onClick={this.moveToPostAJobSection}>here</Link> to post a job, find the best talent, and grow your practice!</p>
              </div>
            </div>
            <div className="row mb-35 v-center">
              <div className="col-sm-2 text-center">
                <span className="icon-contact-icon"><span className="path1"></span><span className="path2"></span></span>
              </div>
              <div className="col-sm-10">
                <p>Questions or suggestions? Click <Link to={this.routesPath['SUPPORT_CENTER']} className="click-here">here</Link> to get in touch with the Legably team!</p>
              </div>
            </div>
          </div>

          <div className="nxt-prev-btns">
            <button type="click" onClick={() => utils.changeUrl(this.routesPath['SEEKER_JOB_TYPE'])} className="previouse-btn btn pull-left mb-10">Previous</button >
            <span className="clear-fix"></span>
          </div>
        </div>
      </Role>
    );
  }
}

export default GetStarted;
