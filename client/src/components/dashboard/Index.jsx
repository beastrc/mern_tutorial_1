import React from 'react';
import { Link, browserHistory } from 'react-router';

import { constant, helper, utils, cookieManager } from '../../shared/index';
import ModalPopup from '../shared/modal-popup/ModalPopup';

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      hideLeftPanel: false,
      selectedPage: constant['ROUTES_PATH']['JOB_SEARCH'],
      modalPopupObj: {}
    };
  }


  moveToPage(page, associatedUser) {
    if (associatedUser === 'seeker') {
      if (!utils.isSeekerProfileCompleted()) {
        helper.openIncompleteProfilePopup(this, 'seeker');
        return;
      }
    } else if (associatedUser === 'poster') {
      if (!utils.isPosterProfileCompleted()) {
        helper.openIncompleteProfilePopup(this, 'poster');
        return;
      }
    }

    helper.closeLeftPanel();
    this.setActiveClassOnMenu(page);
    utils.changeUrl(page);
  }

  setActiveClassOnMenu(page) {
    this.setState({
      selectedPage: page
    });
  }

  componentDidMount() {
    this.setActiveClassOnMenu(location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    let urlParam = null;
    let pathName = location.pathname;
    if (pathName.includes(constant['ROUTES_PATH']['PROFILE'])) {
      urlParam = (pathName.substr(pathName.lastIndexOf('/') + 1));
    }
    this.setState({
      hideLeftPanel: (urlParam === 'attorney' || urlParam === 'firm')
    });

    this.setActiveClassOnMenu(location.pathname);
  }

  // js for toggling hamburger -----------------------
  toggleHamburger() {
    // temporary solution. change this logic using react.
    var me = $(".main-nav:visible");
    if (me.hasClass( "cross-icon" )) {
      $(".header-wrapper").removeClass("fade-layer-before");
      $('#sidebar').removeClass('slide-show mobile-menu');
      me.removeClass('cross-icon');
      // me.addClass('open');
    } else {
      // me.removeClass('open');
      $(".header-wrapper").addClass("fade-layer-before");
      $('#sidebar').addClass('slide-show mobile-menu');
      me.addClass('cross-icon');
    }
  }

  render() {
    let selectedPage = this.state.selectedPage;
    let routesPath = constant['ROUTES_PATH'];

    return (
    	<div className="flex-to-block">
        { this.state.hideLeftPanel === true ?
          null
        :
          <aside className="d-flex sidebar-wrapper pull-left">
            <a className="main-nav left hamburger-icon" onClick={this.toggleHamburger}>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </a>
            <nav id="sidebar" className="sidebar-fixed">
              {/*Sidebar Header */}
              <div className="sidebar-header">
                <h3>Searching</h3>
              </div>
              {/*Sidebar Links*/}
              <ul className="list-unstyled components">
              <li onClick={() => this.moveToPage(routesPath['JOB_SEARCH'], 'seeker')} className={selectedPage.includes(routesPath['JOB_SEARCH']) ? 'active' : ''}>
                  <a>
                    <i className="fa fa-search" aria-hidden="true"></i>
                    Jobs
                  </a>
                </li>
                {/*
                <li>
                  <a href="#">
                    <i className="fa fa-check-circle-o" aria-hidden="true"></i>
                  SAVED JOBS</a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-files-o" aria-hidden="true"></i>
                  JOB MATCHES</a>
                </li>
                */}
                {/* <li onClick={() => this.moveToPage(routesPath['MY_APPLIED_JOBS'], 'seeker')} className={selectedPage.includes(routesPath['MY_APPLIED_JOBS']) ? 'active' : ''}>
                  <a>
                    <i className="fa fa-file-text-o" aria-hidden="true"></i>
                  My Jobs</a>
                </li> */}
                <li onClick={() => this.moveToPage(routesPath['PROJECT_SEARCH'], 'seeker')} className={selectedPage.includes(routesPath['PROJECT_SEARCH']) ? 'active' : ''}>
                  <a>
                    <i className="fa fa-search" aria-hidden="true"></i>
                    Projects
                  </a>
                </li>
                <li onClick={() => this.moveToPage(routesPath['CANDIDATE_SEARCH'], 'poster')} className={(selectedPage.includes(routesPath['CANDIDATE_SEARCH']) || (selectedPage.includes('profile') && !selectedPage.endsWith('attorney') && !selectedPage.endsWith('firm'))) ? 'active' : ''}>
                  <a href="#">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  Candidates</a>
                </li>
                {/*
                <li>
                  <a href="#">
                    <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                  Deliverables</a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-usd" aria-hidden="true"></i>
                  Payments</a>
                </li>
                */}
              </ul>

              {/*Sidebar Header */}
              <div className="sidebar-header">
                <h3>Posting</h3>
              </div>

              {/*Sidebar Links*/}
              <ul className="list-unstyled components">
              <li onClick={() => this.moveToPage(routesPath['POST_JOB'], 'poster')} className={selectedPage.includes('post-job') ? 'active' : ''}>
                  <a>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                  New Job</a>
                </li>
                <li onClick={() => this.moveToPage(routesPath['POST_PROJECT'], 'poster')} className={selectedPage.includes('post-project') ? 'active' : '' ? 'active' : ''}>
                  <a>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                   New Project</a>
                </li>
                {/* <li>
                  <a href="#">
                    <i className="fa fa-check-circle-o" aria-hidden="true"></i>
                  Saved Candidates</a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                  Deliverables</a>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-usd" aria-hidden="true"></i>
                  Payments</a>
                </li> */}
              </ul>
              {/*Sidebar Header */}
              <div className="sidebar-header">
                <h3>Your Work</h3>
              </div>

              {/*Sidebar Links*/} 
              <ul className="list-unstyled components">
                <li onClick={() =>  this.moveToPage(routesPath['MY_APPLIED_JOBS'], 'seeker')} className={selectedPage.includes(routesPath['MY_APPLIED_JOBS']) ? 'active' : ''}>
                  <a>
                    <i className="fa fa-file-text-o" aria-hidden="true"></i>
                  Seeker</a>
                </li>
                <li onClick={() => this.moveToPage(routesPath['MY_POSTED_JOBS'], 'poster')} className={(selectedPage.includes(routesPath['MY_POSTED_JOBS']) || (selectedPage.includes('profile') && !selectedPage.endsWith('attorney') && !selectedPage.endsWith('firm'))) ? 'active' : ''}>
                  <a>
                    <i className="fa fa-file-text-o" aria-hidden="true"></i>
                  Poster</a>
                </li>
              </ul>

            </nav>

            <ModalPopup modalPopupObj={this.state.modalPopupObj} />
          </aside>
        }
        {this.props.children}
      </div>
    );
  }
}
