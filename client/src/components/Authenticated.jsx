import React from 'react';

import { constant, utils, sessionManager } from '../shared/index';

export default class Authenticated extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      isSession: false
    };
    this.checkSession = this.checkSession.bind(this);
  }

  componentDidMount() {
  	this.setState({isSession : sessionManager.isSession()}, function(){
		  this.checkSession();
    });
  }

  checkSession() {
    if (this.state.isSession) {
      var role = utils.getUserRole();
      var isAdmin = this.props.location.pathname.includes('admin');
      if (role === 'admin' && !isAdmin) {
        utils.changeUrl("/admin-dashboard");
      } else if (role === 'user' && isAdmin) {
        utils.redirectionHandle();
      }
    } else {
      setTimeout(function() {
        utils.changeUrl(constant['ROUTES_PATH']['SIGN_IN']);
      }, 0);
    }
  }

  render() {
    const { children } = this.props;
    var childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { forceUpdateHeader: this.props.forceUpdateHeader }));
    return (this.state.isSession) ? <div>{childrenWithProps}</div> : null;
  }
}
