import React from 'react';
import { Link } from 'react-router';

import { constant } from '../../../shared/index';

export default class LegablyFooter extends React.Component {

  componentWillReceiveProps(nextProps) {
    if ($('.large-footer:visible').length === 0) {
      $('body').css({'padding-bottom': $('footer').outerHeight() + "px"});  // sticky footer
    } else {
      $('body').css({'padding-bottom': 0});
    }
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <footer className="basic-info-footer">
        <div className="footer-container row">
          <div className="footer-left col-sm-3">
            <span>&copy; 2018 Legably Inc.</span>
          </div>
          <div className="footer-right col-sm-9">
            <ul className="list-inline">
              <li className="list-inline-item"><a  href={routesPath['BLOG']} target='_blank'>Blog</a></li>
              <li className="list-inline-item"><Link to={routesPath['FAQ']}>FAQ's</Link></li>
              <li className="list-inline-item"><Link to={routesPath['COMPANY_OVERVIEW']}>About Us</Link></li>
              <li className="list-inline-item"><Link to={routesPath['SUPPORT_CENTER']}>Support and Suggestions</Link></li>
              <li className="list-inline-item"><Link to={routesPath['TERMS_OF_SERVICE']}>Terms of Service</Link></li>
              <li className="list-inline-item"><Link to={routesPath['PRIVACY_POLICY']}>Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="clear-fix"></div>
        </div>
      </footer>
    );
  }
}
