import React from 'react';
import { Link, browserHistory } from 'react-router';
let classNames = require('classnames');

import { LegablyLargeFooter } from '../index';
import { constant, cookieManager, helper, utils } from '../../shared/index';
import ModalPopup from '../shared/modal-popup/ModalPopup';

const managedServicesTitle = "Legably Will Find You An Attorney And Manage Your Project"
const managedServicesText = [
  "If you'd like a little help getting started, Legably offers managed services using our network of vetted attorneys. Contact us, answer a few questions about your project, and we will post it to the Legably platform.",
  "Once your job is posted we will search our network to find the attorneys best suited for your project. With your approval we will hire the attorney of your choice and manage your project to completion.",
  "Managed services are free to use—we only get paid after you hire an attorney to handle your project and the work has been completed successfully.",
]
const managedServicesContactUsInfo = "\
  mailto:info@legably.com\
  ?subject=Tell Us About Your Project\
  &bcc=dreilly@legably.com\
  &body=Please replace this text with a brief description about your project and any other information that would help us narrow down a list of candidates like practice areas, states licensed, and any other specific requirements. The more information you can provide the better. Once we receive and review this information, someone from our Managed Services team will be in touch to get the process started.\
  ";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: '',
      emailValid: false,
      is_seeker_profile_completed: false,
      is_poster_profile_completed: false,
      modalPopupObj: {},
      scrollTop: 0
    };
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
    this.onGetStartedKeyUp = this.onGetStartedKeyUp.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.moveToTop = this.moveToTop.bind(this);
  }

  componentDidMount() {
    var userData = utils.getCurrentUser();
    if (userData) {
      this.setState({
        is_seeker_profile_completed: userData.is_seeker_profile_completed,
        is_poster_profile_completed: userData.is_poster_profile_completed
      });
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    let target = event.srcElement || event.target;
    this.setState({
      scrollTop: target.body.scrollTop
    });
  }

  moveToTop() {
    var doc = document.documentElement;
    var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (top > 0) {
      window.scrollTo(0, top - 25);
      setTimeout(this.moveToTop, 5);
    }
  }

  changeUrl(url) {
    browserHistory.push({
      pathname: url,
      state: { email: this.state.email }
    });
  }

  onGetStartedKeyUp(evt) {
    if (evt.keyCode == 13 || evt.which == 13) {
      this.handleClick();
    }
  }

  handleUserInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleInputOnBlur(e) {
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.value) {
      this.state.emailValid = e.target.value.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
      this.state.emailError = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
      this.setState({ emailError: this.state.emailError, emailValid: this.state.emailValid })
    } else {
      this.setState({ emailError: constant.ENTER_EMAIL, emailValid: false })
    }
  }

  handleClick() {
    if (this.state.email) {
      this.state.emailValid = this.state.email.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
      this.state.emailError = this.state.emailValid ? '' : constant.INVALID_EMAIL_ADD;
      this.setState({ emailError: this.state.emailError, emailValid: this.state.emailValid })
    } else {
      this.setState({ emailError: constant.ENTER_EMAIL, emailValid: false })
    }

    if (this.state.emailValid) {
      this.changeUrl(constant['ROUTES_PATH']['SIGN_UP']);
    }
  }

  movePage(url) {
    let routesPath = constant['ROUTES_PATH'];
    if (url === routesPath['JOB_SEARCH']) {
      if (!this.state.is_seeker_profile_completed) {
        helper.openIncompleteProfilePopup(this, 'seeker');
        return;
      }
    } else if (url === routesPath['POST_JOB']) {
      if (!this.state.is_poster_profile_completed) {
        helper.openIncompleteProfilePopup(this, 'poster')
        return;
      }
    }
    utils.changeUrl(url);
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];
    var partenerClass = classNames({
      'right-div col-sm-6': true,
      'col-sm-offset-3': this.props.session
    });

    let scrollClass = classNames({
      'move-to-top': true,
      'd-block': this.state.scrollTop > 350
    });

    return (
      <div className="bg-white">
        <div className="home-page-wrapper">
          <div className="banner">
            <div className="banner-content">
              <h4>Hire the best <span>freelance</span> project attorney.</h4>
              <p>Legably is the top network of freelance project attorneys for law firms, in-house legal teams, legal staffing firms, and companies.</p>
              {
                this.props.session ?
                  <div className="relative mt-15">
                    <button className="transy-btn yellow-btn mr-10" type="button" onClick={() => this.movePage(routesPath['POST_JOB'])}> Hire Remote Project Attorneys </button><br/>
                    <button className="transy-btn" type="button" onClick={() => this.movePage(routesPath['JOB_SEARCH'])}> Join Our Network Of Attorneys </button>
                  </div>
                  :
                  <div className="relative">
                    <div className={this.state.emailError !== '' ? "input-group global-error" : "input-group"}>
                      <input type="text" className="form-control" placeholder="Enter your email" name="email" value={this.state.email} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} onKeyUp={this.onGetStartedKeyUp} />
                      <span className="input-group-btn">
                        <button className="btn btn-secondary" type="button" onClick={this.handleClick}>Get Started!</button>
                      </span>
                    </div>
                    <p className="error"><span>{this.state.emailError !== '' ? this.state.emailError : ''}</span></p>
                  </div>
              }
              {
                this.props.session ?
                  null
                  :
                  <p>Already have a Legably account? <span onClick={() => this.changeUrl(routesPath['SIGN_IN'])}>Sign-In</span></p>
              }
            </div>
          </div>

          <section className="floating-section" style={{ marginBottom: 60 }}>
            <div className="floating-div row" style={{ padding: 50 }}>
              <div className="row">
                <div className="row list-wrapper" style={{ margin: 0 }}>
                  <h1 style={{ marginBottom: 20, marginTop: 0 }}>{managedServicesTitle}</h1>
                  {managedServicesText.reduce((acc, p, i) => acc.concat(<p key={p[0] + i} style={{ textAlign: 'left', margin: '15 70' }}>{p}</p>), [])}
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: -20 }}>
                    <p style={{ textAlign: 'left', margin: '0 70', width: "100%" }}>Click the Contact Us button to get started.</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <a className="flex-centered contact-us-btn" href={managedServicesContactUsInfo}>Contact Us</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="floating-section">
            <div className="floating-div row">
              <div className="row">
                <div className="col-sm-4">
                  <span className="icon">
                    <img src={constant['IMG_PATH'] + 'note-pad-oval.png'} alt="microscope" />
                  </span>
                  <h4>Work On Your Terms</h4>
                  <p>Legably gives attorneys seeking freelance (hourly- or project-based) work the opportunity to find great on-site and remote jobs that match their skill-set, interests, and availability. Whether you’re interested in working as a full-time freelancer or supplementing income from your existing position, Legably is the place to be.</p>
                </div>
                <div className="col-sm-4">
                  <span className="icon">
                    <img src={constant['IMG_PATH'] + 'join-hands.png'} alt="target" />
                  </span>
                  <h4>Connect Directly</h4>
                  <p>The Legably platform facilitates a direct connection between attorneys seeking work and attorneys and firms in need of their services—allowing both parties to get to work quickly and avoid the headaches, inefficiencies, and high-fees associated with traditional legal staffing agencies and hiring processes.</p>
                </div>
                <div className="col-sm-4">
                  <span className="icon">
                    <img src={constant['IMG_PATH'] + 'grow-img.png'} alt="edit-pad" />
                  </span>
                  <h4>Grow Your Practice</h4>
                  <p>Legably gives attorneys and firms the ability to handle more clients, generate more revenue, and grow their practices without the overhead and risk associated with hiring a full-time employee by providing access to on-demand services from highly skilled attorneys specializing in a wide-variety of practice areas across the U.S.</p>
                </div>
              </div>
            </div>
          </section>

           <section className="how-it-works">
            <div className="floating-div row">
              <div className="left-div col-lg-12">
                <h3 className="text-left">How It Works</h3>
                <p>Attorneys on the Legably network are vetted to ensure that they are licensed and in good standing in at least one US jurisdiction. There are several thousand attorneys from all fifty states presently on the Legably platform ready to help you tackle your next legal project.</p>
                <h3 className="text-left" style={{marginTop: 50}}>What We Offer</h3>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="card how-card">
                      <h4>Post a Project</h4>
                      <p>Post a project on the platform identifying your specific needs, geographic requirements, minimum level of experience, and other criteria.</p>
                      <div className="arrow"/>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="card how-card">
                      <h4>Hire an Attorney</h4>
                      <p>Attorneys who meet your criteria will be notified and will begin applying to your project. Additionally, you may search through our network of attorneys to invite specific candidates to apply to your project.</p>
                      <div className="arrow"/>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="card how-card">
                      <h4>Manage Your Project</h4>
                      <p>Easily transfer documents, message your attorney, and set specific deliverables or milestones for your attorney to meet. Follow the work in real time and pay either on a milestone basis or when the entire project is delivered.</p>
                      <div className="arrow"/>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="card how-card">
                      <h4>Complete Your Project</h4>
                      <p>Complete payment through the Legably platform for all work performed, and rate your attorney for the work they have completed. Legably takes care of all tax reporting for any contractor work performed, so you don’t have to.</p>
                    </div>
                  </div>
                </div>
                <p className="add-desc">
                  Legably attorneys support your existing team or provide standalone legal support. Flexibly manage legal work requiring different practice specialties, state licensure, or other special requirements. Our pool of vetted attorneys are ready today to support your practice, in-house legal team, or legal staffing firm with your needs.
                </p>
              </div>
            </div>
          </section> 

          <section className="get-started">
            <div className="row">
              {!this.props.session ?
                <div className="left-div col-sm-6">
                  <div className="row vr-saperator separator mr-0">
                    <div className="col-sm-10 p-0">
                      <h4>Get Started Today</h4>
                      <p>Sign-up today for free and start exploring great opportunities or finding the attorneys you need to grow your practice. </p>
                      <button type="button" onClick={() => this.changeUrl(routesPath['SIGN_UP'])}>Get Started!</button>
                    </div>
                  </div>
                </div>
                : ''
              }

              <div className={partenerClass}>
                <div className="row mr-0">
                  <div className="col-sm-10 col-sm-offset-1 p-0">
                    <h4>PARTNERS</h4>
                    <p>Legably is the preferred legal staffing solution for users of Clio, a leading global legal practice management software provider. </p>
                    <Link><img src="images/legably-partner-responsive.png" alt="legably" /></Link>
                    <span>+</span>
                    <Link><img src="images/clio-logo-responsive.png" /></Link>
                  </div>
                </div>
              </div>
            </div>
            <a className={scrollClass} onClick={this.moveToTop} href="javascript:void(0)">
              <i className="fa fa-long-arrow-up" aria-hidden="true"></i>
            </a>
          </section>

          <ModalPopup modalPopupObj={this.state.modalPopupObj} />
        </div>
        {!this.props.session && <LegablyLargeFooter />}
      </div>
    );
  }
}