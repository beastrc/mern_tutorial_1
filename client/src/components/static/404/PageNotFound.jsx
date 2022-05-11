import React from 'react';

import { constant, utils } from '../../../shared/index';

export default class PageNotFound extends React.Component {
	constructor(props) {
    super(props);
  }

  render() {
    return (
    	<div className="error-page">
        <div className="container">
          <div className="row text-center">
  	        <h1 className="error">404</h1>
            <h4>Oops! page not found.</h4>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <button className="btn" onClick={() => utils.goToHome()}>Back To Homepage</button>
          </div>
        </div>
      </div>
    );
  }
}
