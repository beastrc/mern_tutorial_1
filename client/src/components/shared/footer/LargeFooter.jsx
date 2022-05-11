import React from 'react';
import { Link } from 'react-router';

import { constant } from '../../../shared/index';

export default class LegablyLargeFooter extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      collapsible: {
        showAboutUsAddBtn: true,
        showUsefullLinkAddBtn: true
      }
    };
    this.slideDiv = this.slideDiv.bind(this);
    this.hideAllCollapse = this.hideAllCollapse.bind(this);
  }

  componentDidMount () {
    if ($('.large-footer:visible').length === 0) {
      $('body').css({'padding-bottom': $('footer').outerHeight() + "px"});  // sticky footer
    } else {
      $('body').css({'padding-bottom': 0});
    }
  }

  hideAllCollapse (exceptCollapse) {
    var stateObj = this.state.collapsible;
    $('.footer-inner').slideUp('slow');
    for(var key in stateObj) {
      if(key != exceptCollapse) {
        stateObj[key] = true;
      }
    }
    this.setState({collapsible: stateObj});
  }

  slideDiv (ev, id, stateKey) {
    var _this = this;
    this.hideAllCollapse(stateKey);

    setTimeout(function () {
      var stateObj = _this.state.collapsible;
      var hidden = _this.state.collapsible[stateKey];
      var ele = $('#'+id);
      if(!hidden) {
        ele.slideUp('slow');  // hide
      } else {
        ele.slideDown('slow'); // show
      }
      stateObj[stateKey] = !hidden;
      _this.setState({collapsible: stateObj});
    });
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <footer className="footer large-footer">
        <div className="container">
          <div className="row">
            <div className="col-sm-4">
              <div className="content-container">
                <h3 className={'footer-head ' + (this.state.collapsible.showAboutUsAddBtn ? 'add-icon' : 'sub-icon')} onClick={(e) => this.slideDiv(e, 'abtCollapse', 'showAboutUsAddBtn')}>About Us</h3>
                <div id="abtCollapse" className="footer-inner">
                  <p><Link to={routesPath['COMPANY_OVERVIEW']} title="Company Overview">Company Overview</Link></p>
                  <p><Link to={routesPath['PRIVACY_POLICY']} title="Privacy Policy">Privacy Policy</Link></p>
                  <p><Link to={routesPath['TERMS_OF_SERVICE']} title="Terms of Service">Terms of Service</Link></p>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="content-container">
                <h3 className={'footer-head ' + (this.state.collapsible.showUsefullLinkAddBtn ? 'add-icon' : 'sub-icon')} onClick={(e) => this.slideDiv(e, 'usefullCollapse', 'showUsefullLinkAddBtn')}>Useful Links</h3>
                <div id="usefullCollapse" className="footer-inner">
                  <p><Link to={routesPath['FAQ']} title="FAQs">FAQs</Link></p>
                  <p><Link to={routesPath['SUPPORT_CENTER']} title="Support and Suggestions">Support and Suggestions</Link></p>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <h3>Follow Us</h3>
              <ul className="social-icons">
                <li>
                  <a href="http://www.facebook.com/Legably" title="Facebook" target="_blank">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/Legably" title="Twitter" target="_blank">
                    <i className="fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/legably" title="LinkedIn" target="_blank">
                    <i className="fa fa-linkedin"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p className="copyright">&copy; 2018 Legably Inc.</p>
        </div>
      </footer>
    );
  }
}
