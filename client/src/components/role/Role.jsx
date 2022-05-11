import React from 'react';
import { Link } from 'react-router';

import { constant, helper, utils, cookieManager } from '../../shared/index';
import ModalPopup from '../shared/modal-popup/ModalPopup';

export default class Role extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      modalPopupObj: {}
    };
    this.showPopup = this.showPopup.bind(this);
    this.isSeekerProfile = this.isSeekerProfile.bind(this);
    this.leaveRole = this.leaveRole.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.openIncompleteProfilePopup === true) {
      helper.openIncompleteProfilePopup(this, 'poster');
    }
  }

  showPopup(role) {
    if (role !== this.props.role) {
      if (this.props.step === 'get_started' || this.props.step === 'thank_you') {
        this.leaveRole();
      } else {
        let _that = this;
        let popupType = constant['POPUP_TYPES']['CONFIRM'];
        _that.setState({
          modalPopupObj: {
            type: popupType,
            iconImgUrl: constant['IMG_PATH'] + 'svg-images/negative-alert-icon.svg',
            msg: constant['POPUP_MSG']['LEAVE_ROLE'],
            noBtnText: 'Cancel',
            yesBtnText: 'Leave',
            noBtnAction: function() { utils.modalPopup(popupType, 'hide', _that) },
            yesBtnAction: function() {
              utils.modalPopup(popupType, 'hide', _that);
              _that.leaveRole();
            }
          }
        }, function() {
          utils.modalPopup(popupType, 'show', self);
        });
      }
    }
  }

  isSeekerProfile() {
    return this.props.role === constant['ROLE']['SEEKER'];
  }

  leaveRole() {
    utils.moveToLastUpdatedEditProfilePage(!this.isSeekerProfile());
  }

  render(){
    return (
      <div className="pro-basic-info content-wrapper container">
        <div className="common-top-content">
          {{
            basic_info_edu: [
              <h3 key="title">Basic Info + Education</h3>,
              <p key="desc">To get started, please let us know whether you are interested in using Legably to find a job or to post a job by making a selection below. Then, complete the following form to proceed.</p>
            ],
            experience: [
              <h3 key="title">Experience</h3>,
              <p key="desc">Next, please provide us with some basic information regarding your work experience.</p>
            ],
            headline: [
              <h3 key="title">Headline + Additional Info</h3>,
              <p key="desc">Next, please create your Legably profile headline and provide a brief bio, your resume, and writing samples or other sample work-product (optional).</p>
            ],
            job_type: [
              <h3 key="title">Job Type</h3>,
              <p key="desc">Finally, please provide details regarding the type of opportunities you are interested in exploring on Legably.</p>
            ],
            get_started: [
              <h3 key="title">Thank You!</h3>
            ],
            basic_info: [
              <h3 key="title">Basic Information</h3>,
              <p key="desc">To get started, please let us know whether you are interested in using Legably to find a job or to post a job by making a selection below.  Then, complete the following form to proceed.</p>
            ],
            thank_you: [
              <h3 key="title">Thank You!</h3>
            ]
          }[this.props.step]}

          <div className="tabs">
            <button name="seeker" className = {'btn tab-btn-white m-0' + (this.isSeekerProfile() ? ' tab-btn-blue' : '')} onClick={() => this.showPopup('seeker')}>I want to find a job</button>
            <button name="poster" className = {'btn tab-btn-white m-0' + (this.isSeekerProfile() ? '' : ' tab-btn-blue')} onClick={() => this.showPopup('poster')}>I want to post a job</button>
          </div>
        </div>
        {this.isSeekerProfile() ? <SeekerSteps step={this.props.step} profileStatus={this.props.profileStatus}/> : <PosterSteps step={this.props.step} profileStatus={this.props.profileStatus}/>}

        {this.props.children}

        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div>
    );
  }
}

class PosterSteps extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      stepArr: ['basic_info', 'thank_you']
    }
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <section className="steps-widget">
        <div className="board-inner">
          <ul className="nav nav-tabs" id="myTab">
            <div className="liner"></div>
            <li className={`${this.props.step === 'basic_info' ? 'active fill' : 'fill'}`}>
              <Link to={routesPath['POSTER_BASIC_INFO']}>
                <span className="round-tabs one"></span>
              </Link>
              <span onClick={() => utils.changeUrl(routesPath['POSTER_BASIC_INFO'])}>Basic Information</span><span></span>
            </li>
            <li className='v-hidden'>
              <Link>
                <span className="round-tabs two"></span>
              </Link>
              <span>Post Job</span><span></span>
            </li>
            <li className='v-hidden'>
              <Link>
                <span className="round-tabs three"></span>
              </Link>
              <span>Post Job</span><span></span>
            </li>
            <li className='v-hidden'>
              <Link>
                <span className="round-tabs four"></span>
              </Link>
              <span>Post Job</span><span></span>
            </li>
            <li className={`${this.props.step === 'thank_you' ? 'active' : ''} ${((this.state.stepArr).indexOf(this.props.step) >= 1 || this.props.profileStatus === 1) ? 'fill' : ''} ${(this.props.profileStatus < 1) ? 'disabled-element' : ''}`}>
              <Link to={routesPath['POSTER_THANK_YOU']}>
                <span className="round-tabs five"></span>
              </Link>
              <span onClick={() => utils.changeUrl(routesPath['POSTER_THANK_YOU'])}>Thank You!</span><span></span>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

class SeekerSteps extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      stepArr: ['basic_info_edu', 'experience', 'headline', 'job_type', 'get_started']
    }
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <section className="steps-widget">
        <div className="board-inner">
          <ul className="nav nav-tabs" id="myTab">
            <div className="liner"></div>
            <li className={`${this.props.step === 'basic_info_edu' ? 'active fill' : 'fill'}`}>
              <Link to={routesPath['SEEKER_BASIC_INFO']}>
                <span className="round-tabs one"></span>
              </Link>
              <span onClick={() => utils.changeUrl(routesPath['SEEKER_BASIC_INFO'])}>Basic Info + Education</span><span></span>
            </li>
            <li className={`${this.props.step === 'experience' ? 'active' : ''} ${((this.state.stepArr).indexOf(this.props.step) >= 1 || this.props.profileStatus === 4) ? 'fill' : ''} ${(this.props.profileStatus < 1) ? 'disabled-element' : ''}`}>
              <Link to={routesPath['SEEKER_EXEPERIENCE']}>
                <span className="round-tabs two"></span>
              </Link>
              <span onClick={() => utils.changeUrl(routesPath['SEEKER_EXEPERIENCE'])}>Experience</span><span></span>
            </li>
            <li className={`${this.props.step === 'headline' ? 'active' : ''} ${((this.state.stepArr).indexOf(this.props.step) >= 2 || this.props.profileStatus === 4) ? 'fill' : ''} ${(this.props.profileStatus < 2) ? 'disabled-element' : ''}`}>
              <Link to={routesPath['SEEKER_HEADLINE']}>
                <span className="round-tabs three"></span>
              </Link>
              <span onClick={() => utils.changeUrl(routesPath['SEEKER_HEADLINE'])}>Headline + Additional Info</span><span></span>
            </li>
            <li className={`${this.props.step === 'job_type' ? 'active' : ''} ${((this.state.stepArr).indexOf(this.props.step) >= 3 || this.props.profileStatus === 4) ? 'fill' : ''} ${(this.props.profileStatus < 3)? 'disabled-element' : ''}`}>
              <Link to={routesPath['SEEKER_JOB_TYPE']}>
                <span className="round-tabs four"></span>
              </Link>
              <span onClick={() => utils.changeUrl(routesPath['SEEKER_JOB_TYPE'])}>Job Type</span><span></span>
            </li>
            <li className={`${this.props.step === 'get_started' ? 'active' : ''} ${((this.state.stepArr).indexOf(this.props.step) >= 4 || this.props.profileStatus === 4) ? 'fill' : ''} ${(this.props.profileStatus < 4) ? 'disabled-element' : ''}`}>
              <Link to={routesPath['SEEKER_GET_STARTED']}>
                <span className="round-tabs five"></span>
              </Link>
              <span onClick={() => utils.changeUrl(routesPath['SEEKER_GET_STARTED'])}>Thank You!</span>
              <span></span>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}
