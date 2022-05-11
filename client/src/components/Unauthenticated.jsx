import React from 'react';

import { utils, sessionManager } from '../shared/index';

export default class Unauthenticated extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSession: false
    };
    this.checkSession = this.checkSession.bind(this);
  }

  componentDidMount() {
    this.setState({isSession: sessionManager.isSession()}, function() {
      this.checkSession();
    });
  }

  checkSession() {
    if(this.state.isSession) {
      utils.redirectionHandle();
    }
  }

  render() {
    return (!this.state.isSession) ? this.props.children : null;
  }
}
