import React from 'react';
import Messenger from './Messenger';

export default class MessageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <Messenger />
    );
  }
}