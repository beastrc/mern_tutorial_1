import React from 'react';
import { Link } from 'react-router';

import { Link as Scroll } from 'react-scroll'

import IconButton from '../iconButton';

let Dropdown, MenuItem;
let classNames = require('classnames');

import { constant, helper, utils, cookieManager, sessionManager } from '../../../shared/index';
import ModalPopup from '../modal-popup/ModalPopup';

export default class LegablyHeader extends React.Component {

  constructor(props) {
    super(props);
    this.routesPath = constant['ROUTES_PATH'];
    this.state = {
      first_name: '',
      last_name: '',
      token: '',
      photo: '',
      currentPage: props.currentPage,
      role: '',
      is_seeker_profile_completed: false,
      is_poster_profile_completed: false,
      modalPopupObj: {},
      stripe_dashboard_link: ''
    };
    this.profileImgError = this.profileImgError.bind(this);
    this.onLegablyLogoClick = this.onLegablyLogoClick.bind(this);
    this.onBriefcaseIconClick = this.onBriefcaseIconClick.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setHeaderContent();
    sessionManager.isSession() && this.checkStripeAccountAndGetDashboardLink();
  }

  componentWillReceiveProps(nextProps) {
    this.setHeaderContent();
    this.setState({
      currentPage: nextProps.currentPage
    });
  }

  checkStripeAccountAndGetDashboardLink() {
    let that = this;
    utils.apiCall('GET_STRIPE_DASHBOARD_LINK', { 'data': {} }, function (err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting stripe dashboard link');
        utils.logger('error', 'Get Stripe Dashboard Link Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          that.setState({
            stripe_dashboard_link: utils.getDataFromRes(response, 'url')
          })
        }
      }
    });
  }

  setHeaderContent() {
    var userData = utils.getCurrentUser();
    if (userData) {
      let userImage = userData.image || '';
      this.setState({
        first_name: userData.first_name,
        last_name: userData.last_name,
        token: userData.token,
        photo: userImage,
        role: utils.getUserRole(),
        is_seeker_profile_completed: userData.is_seeker_profile_completed,
        is_poster_profile_completed: userData.is_poster_profile_completed,
      });
    }
  }

  profileImgError(evt) {
    return utils.onImgError(evt, '/images/default-profile-pic.png');
  }

  signOut() {
    utils.apiCall('SIGN_OUT', {}, function (err, response) {
      if (err) {
        utils.flashMsg('show', 'Error in Sign Out');
        utils.logger('error', 'Sign Out Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          utils.logout();
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  componentWillMount() {
    Dropdown = require('react-bootstrap').Dropdown;
    MenuItem = require('react-bootstrap').MenuItem;
  }

  moveToPostOrFindJobSection(url) {
    if (this.props.session) {
      if (url === this.routesPath['JOB_SEARCH']) {
        if (!this.state.is_seeker_profile_completed) {
          helper.openIncompleteProfilePopup(this, 'seeker');
          return;
        }
      } else if (url === this.routesPath['POST_JOB']) {
        if (!this.state.is_poster_profile_completed) {
          helper.openIncompleteProfilePopup(this, 'poster');
          return;
        }
      }
    }
    this.movePage(url);
  }

  openPage(url) {
    window.open(url, '_blank');
  }

  movePage(url) {
    helper.closeLeftPanel();
    if (!this.props.session) {
      cookieManager.set('redirectionPage', url);
      url = this.routesPath['SIGN_IN'];
    }
    utils.changeUrl(url);
  }

  isEitherOneProfileCompleted() {
    return (this.state.is_seeker_profile_completed || this.state.is_poster_profile_completed);
  } 

  onLegablyLogoClick(evt) {
    helper.closeLeftPanel();
    utils.goToHome();
  }

  onBriefcaseIconClick(evt) {
    evt.preventDefault();
    helper.closeLeftPanel();
    if (this.state.is_seeker_profile_completed) {
      utils.changeUrl(this.routesPath['JOB_SEARCH']);
    } else if (this.state.is_poster_profile_completed) {
      utils.changeUrl(this.routesPath['MY_POSTED_JOBS']);
    }
  }

  isHomePage(currentPage) {
    return (currentPage === this.routesPath['HOME']);
  }

  renderDropdownButton(title) {
    let eitherOneProfileCompleted = this.isEitherOneProfileCompleted();
    let stripeDashboardLink = this.state.stripe_dashboard_link;

    return (
      <Dropdown bsStyle='default' id={`dropdown-basic-primary`}>
        <Dropdown.Toggle bsStyle='default' noCaret={false}>
          <span className="user-name">{title} </span> <span className="caret"></span>
        </Dropdown.Toggle>
        {
          this.state.role === 'admin' ?
            <Dropdown.Menu className="super-colors">
              <MenuItem eventKey="4" onClick={() => this.signOut()}>
                <i className="fa fa-sign-out" aria-hidden="true"></i>Sign Out
              </MenuItem>
            </Dropdown.Menu>
            :
            <Dropdown.Menu className="super-colors">
              {
                eitherOneProfileCompleted ?
                  <MenuItem eventKey="1" onClick={() => this.movePage(this.routesPath['PROFILE'] + '/attorney')}>
                    <i className="fa fa-user-circle-o" aria-hidden="true"></i>Attorney Profile
                  </MenuItem>
                  :
                  null
              }
              {
                eitherOneProfileCompleted ?
                  <MenuItem eventKey="2" onClick={() => this.movePage(this.routesPath['PROFILE'] + '/firm')}>
                    <i className="fa fa-user-circle-o" aria-hidden="true"></i>Firm Profile
                  </MenuItem>
                  :
                  null
              }
              {stripeDashboardLink != '' &&
                <MenuItem eventKey="5" onClick={() => this.openPage(stripeDashboardLink)}>
                  <i className="fa fa-window-restore" aria-hidden="true"></i>Payment Info
                  </MenuItem>
              }
              <MenuItem eventKey="5" onClick={() => this.movePage(this.routesPath['SUBSCRIPTIONS'])}>
                <i className="fa fa-window-restore" aria-hidden="true"></i>Subscription Info
              </MenuItem>
              <MenuItem eventKey="3" onClick={() => this.movePage(this.routesPath['CHANGE_PASSWORD'])}>
                <i className="fa fa-key" aria-hidden="true"></i>Change Password
              </MenuItem>
              <MenuItem eventKey="4" onClick={() => this.signOut()}>
                <i className="fa fa-sign-out" aria-hidden="true"></i>Sign Out
              </MenuItem>
            </Dropdown.Menu>
        }
      </Dropdown>
    );
  }

  render() {
    let isTransHeader = this.props.isTransHeader;
    let homePageClass = '', transButton = 'yellow-btn';
    if (isTransHeader == true) {
      homePageClass = 'trans-header';
      transButton = 'transy-btn';
    } else {
      homePageClass = 'mt-70';
    }
    let logoImage = this.props.logoImage;
    let eitherOneProfileCompleted = this.isEitherOneProfileCompleted();
    let isHomePage = this.isHomePage(this.state.currentPage);

    return (
      <div className="header-wrapper">
        <header className={'static-page-header home-page-header hidden-xs-down ' + homePageClass}>
          <nav className="navbar navbar-fixed-top">
            <div className="container-fluid row h-100">
              <div className="navbar-header m-0 col-xs-4 p-0">
                <a className="navbar-brand" href="javascript:void(0);">
                  <img onClick={this.onLegablyLogoClick} src={logoImage} alt="logo" />
                </a>
              </div>
              {this.props.session && !isHomePage ?
                <div className="col-xs-8">
                  <div className="row">
                    {this.state.role !== 'admin' ?
                      eitherOneProfileCompleted ?
                        <div className="navbar-mid-wraper col-xs-7 col-sm-6 pull-left p-0">
                          <button className={"mr-10 " + transButton} type="button" onClick={() => this.moveToPostOrFindJobSection(this.routesPath['POST_JOB'])}> JOIN Our Attorney Network </button>
                          <button className={"" + transButton} type="button" onClick={() => window.location.href = "http://jobs.legably.com"}> HIRE Remote Project Attorneys </button>
                        </div>
                        :
                        null
                      :
                      null
                    }
                    <div className="navbar-right-wraper col-xs-5 col-sm-6 pull-right">
                      <ul className="pull-right menus">
                        {
                          this.state.role !== 'admin' ?
                            eitherOneProfileCompleted ?
                              <li className="mr-15">
                                <Link to={constant['ROUTES_PATH']['CHAT']}>
                                  <IconButton key="info" icon="ion-ios-chatbubbles" />
                                </Link>
                              </li>
                              :
                              null
                            :
                            null
                        }
                        {
                          this.state.role !== 'admin' ?
                            eitherOneProfileCompleted ?
                              <li className="briefcase mr-20">
                                <Link to="javascript:void(0)" onClick={this.onBriefcaseIconClick}>
                                  <IconButton key="info" icon="ion-ios-briefcase" />
                                </Link>
                              </li>
                              :
                              null
                            :
                            null
                        }
                        <li className="p-0">
                          <span className="profile-pic"><img src={this.state.photo ? this.state.photo : constant['IMG_PATH'] + 'default-profile-pic.png'} onError={this.profileImgError} /></span>
                          {/* <Link href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                            <span className="user-name">{this.state.first_name} {this.state.last_name} 1</span>

                          </Link> */}
                          {this.renderDropdownButton(this.state.first_name + ' ' + this.state.last_name)}
                        </li>
                      </ul>
                      <ul className="pull-right menus pr-20">
                        <li className="sign-in-up mr-20">
                          <Link to="/pricing">
                            <span>Pricing</span>
                          </Link>
                        </li>
                        <li className="sign-in-up">
                          <Scroll to="how-it-works" style={{cursor: 'pointer'}} activeClass="active" spy={true} smooth={true} offset={0} duration={500}>
                            <span>How It Works</span>
                          </Scroll>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                :
                <div className="navbar-right-wraper col-xs-8 pull-right text-right">
                  <div className="row m-0">

                    <div className="navbar-mid-wraper col-xs-7 col-sm-6 pull-left p-0">
                      <button className={"mr-10 " + transButton} type="button" onClick={() => this.moveToPostOrFindJobSection(this.routesPath['PROJECT_SEARCH'])}> JOIN Our Attorney Network </button>
                      <button className={"" + transButton} type="button" onClick={() => window.location.href = "http://jobs.legably.com"}> HIRE Remote Project Attorneys </button>
                    </div>
{this.state.role},{eitherOneProfileCompleted}
                    <div className="navbar-right-wraper col-xs-5 col-sm-6 pull-right text-right">
                      
                      {
                        isHomePage && this.props.session ?
                          <ul className="pull-right menus">
                            {
                              this.state.role !== 'admin' ?
                                eitherOneProfileCompleted ?
                                  <li className="mr-15">
                                    <Link to={constant['ROUTES_PATH']['CHAT']}>
                                      <IconButton key="info" icon="ion-ios-chatbubbles" />
                                    </Link>
                                  </li>
                                  :
                                  null
                                :
                                null
                            }
                            {
                              eitherOneProfileCompleted ?
                                <li className="briefcase mr-20">
                                  <Link to="javascript:void(0)" onClick={this.onBriefcaseIconClick}>
                                    <IconButton key="info" icon="ion-ios-briefcase" />
                                  </Link>
                                </li>
                                :
                                null
                            }
                            <li className="p-0 dropdown">
                              <span className="profile-pic"><img src={this.state.photo ? this.state.photo : constant['IMG_PATH'] + 'default-profile-pic.png'} onError={this.profileImgError} /></span>
                              {/*<Link href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                <span className="user-name">{this.state.first_name} {this.state.last_name} 2</span>
                              </Link>*/}
                              {this.renderDropdownButton(this.state.first_name + ' ' + this.state.last_name)}
                            </li>
                          </ul>
                          :
                          <ul className="pull-right menus">
                            <li className="sign-in-up">
                              <span><i className="fa fa-unlock-alt" aria-hidden="true"></i></span>
                              <Link to={this.routesPath['SIGN_IN']}> Sign In</Link>
                              <span> / </span>
                              <Link to={this.routesPath['SIGN_UP']}> Sign Up</Link>
                            </li>
                          </ul>
                      }
                      <ul className="pull-right menus pr-20">
                        <li className="sign-in-up mr-20">
                          <Link to="/pricing">
                            <span>Pricing</span>
                          </Link>
                        </li>
                        <li className="sign-in-up">
                          <Scroll to="how-it-works" style={{cursor: 'pointer'}} activeClass="active" spy={true} smooth={true} offset={0} duration={500}>
                            <span>How It Works</span>
                          </Scroll>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              }
            </div>
          </nav>
        </header>

        <header className={"mobile-header hidden-xs-up static-page-header " + homePageClass}>
          <nav className="navbar navbar-fixed-top">
            <div className="container-fluid row m-0">
              <div className="navbar-header col-xs-4 m-0 p-0">
                <a className="navbar-brand" href="javascript:void(0);">
                  <img id="legably_logo" className="ml-0" onClick={this.onLegablyLogoClick} src={logoImage} alt="logo" width="160" />
                </a>
              </div>

              <div className="navbar-right-wraper col-xs-8 pull-right">
                {
                  this.props.session ?
                    <ul className="pull-right">
                      {
                        eitherOneProfileCompleted ?
                          <li className="mr-15">
                            <Link to={constant['ROUTES_PATH']['CHAT']}>
                              <IconButton key="info" icon="ion-ios-chatbubbles" />
                            </Link>
                          </li>
                          :
                          null
                      }
                      {
                        eitherOneProfileCompleted ?
                          <li className="briefcase mt-5 mr-15">
                            <Link to="javascript:void(0)" onClick={this.onBriefcaseIconClick}>
                              <IconButton key="info" icon="ion-ios-briefcase" />
                            </Link>
                          </li>
                          :
                          null
                      }
                      <li className="p-0 mt-5 dropdown">
                        <span className="profile-pic"><img src={this.state.photo ? this.state.photo : constant['IMG_PATH'] + 'default-profile-pic.png'} onError={this.profileImgError} /></span>
                        {this.renderDropdownButton(this.state.first_name + ' ' + this.state.last_name)}
                      </li>
                    </ul>
                    :
                    <ul className="pull-right">
                      <li className="sign-in-up mt-10">
                        <span><i className="fa fa-unlock-alt" aria-hidden="true"></i></span>
                        <Link to={this.routesPath['SIGN_IN']}> Sign In</Link>
                        <span> / </span>
                        <Link to={this.routesPath['SIGN_UP']}> Sign Up</Link>
                      </li>
                    </ul>
                }
                <ul className="pull-right menus pr-20">
                  <li className="sign-in-up mr-20">
                    <Link to="/pricing">
                      <span>Pricing</span>
                    </Link>
                  </li>
                  <li className="sign-in-up">
                    <Scroll to="how-it-works" style={{cursor: 'pointer'}} activeClass="active" spy={true} smooth={true} offset={0} duration={500}>
                      <span>How It Works</span>
                    </Scroll>
                  </li>
                </ul>
              </div>
              <span className="clearfix"></span>
            </div>

          </nav>
          <div className="navbar-mid-wraper">
            <button onClick={() => this.moveToPostOrFindJobSection(this.routesPath['POST_JOB'])} className="transy-btn" type="button"> Post a Job </button>
            <button onClick={() => this.moveToPostOrFindJobSection(this.routesPath['JOB_SEARCH'])} className="transy-btn ml-10" type="button"> Find a Job </button>
          </div>
          <div id="menu" className="mobile-menu">
            <ul className="mobile-ul">
              <li>
                <Link to={this.routesPath['SIGN_IN']}>
                  <span className="icon-edit-profile"></span>Sign-in
                </Link>
              </li>
              <li>
                <Link to={this.routesPath['SIGN_UP']}>
                  <span className="icon-change-password"></span>Sign-up
                </Link>
              </li>
            </ul>
          </div>
        </header>

        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div >
    );
  }
}
