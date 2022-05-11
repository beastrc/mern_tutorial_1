import React from 'react';
import { Link, browserHistory } from 'react-router';

import { LegablyLargeFooter } from '../../index';
import { constant, utils } from '../../../shared/index';


export default class Pricing extends React.Component {
	constructor (props) {
    super(props);
    this.state = {
    	token : ''
  	};
  }


	render(){
    return (
    	<div className="pricing-page">
        <div className="static-heading">
          <h1>PRICING</h1>
        </div>
        <div className="pricing-content">
          <h1 className="text-center" style={{margin: '40px 0'}}>
            <strong>Choose the best plan that works for you</strong>
          </h1>
          <div className="row" style={{marginTop: 30}}>
            {
              constant['SUBSCRIPTION_TIERS'].map((subscription, key) => 
                <div className="col-lg-4" key={key}>
                  <div className="card subscription-card">
                    <h2><strong>{subscription.title}</strong></h2>
                    <h3>
                      <span className="amount">{subscription.price}</span> {subscription.subtitle}
                    </h3>
                    <div className="separator"></div>
                    <ul className="features">
                      {subscription.details.map((dt, key1) => <li key={key1}>{dt}</li>)}
                    </ul>
                  </div>
                </div>
              )
            }
          </div>
          <h1 className="text-center" style={{margin: '40px 0'}}>
            <strong>More about plans and pricing</strong>
          </h1>
          <p className="more-desc">
            All project fees of 2.5% cover the cost of payment processing and compliance.
            Plans can be canceled at any time but will remain active for the duration that has been already paid for.
            Annual pricing is coming soon - are you interested? Email us <a className="contact-link" href={"mailto:" + constant['SUPPORT_ID']}>here</a>.
          </p>
        </div>
        {!this.state.token && <LegablyLargeFooter />}
      </div>
    );
  }
}
