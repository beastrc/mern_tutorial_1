import React from 'react';

import { constant, utils } from '../../../shared/index';

export default class CreateStripeAccount extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let locQueryObj = this.props.location.query;
    let code = locQueryObj.code;
    let state = locQueryObj.state;
    if (code && state) {
      let req = {
        stripe_auth_code: code,
      }
      utils.apiCall('SET_STRIPE_ACCOUNT_INFO', { 'data': req }, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while setting Stripe Account Info');
          utils.logger('error', 'Set Stripe Account Info Error -->', err);
        } else {
          if (utils.isResSuccess(response)) {
            let stateArr = state.split('_');
            let pathNameKey = (stateArr[0] === constant['ROLE']['SEEKER'] ? 'MY_APPLIED_JOBS' : 'MY_POSTED_JOBS');
            utils.changeUrl(constant['ROUTES_PATH'][pathNameKey] + '/' + stateArr[1]);
          } else {
            utils.flashMsg('show', utils.getServerErrorMsg(response));
          }
        }
      });
    }
  }

  render() {
    return (
      <div className="job-search-card under-construction">
        <div className="text-center"></div>
      </div>
    );
  }
}
