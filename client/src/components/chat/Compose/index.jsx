import React from 'react';

import { constant, utils, socket } from '../../../shared/index';
export default class Compose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: socket.io(),
      chatHistory: [],
      input: ''
    };
    console.log('compose created');
    let userData = utils.getCurrentUser();
    this.onRegister(userData.id);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onInput = this.onInput.bind(this);
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidUpdate() {
    // this.scrollChatToBottom();
  }

  onInput(e) {
    this.setState({
      input: e.target.value
    });
  };

  onRegister(id) {
    const onRegisterResponse = (user) => this.setState({ user });
    this.state.client.register(id, (err, user) => {
      if (err) return onRegisterResponse(null);
      return onRegisterResponse(user);
    });
  };

  onSendMessage(message, cb) {
    if (!this.state.input) return;
    console.log(utils.getLegablyStorage('current_chatroom')[0]);
    console.log(this.state.input);
    this.state.client.message(utils.getLegablyStorage('current_chatroom')[0], this.state.input, cb)
    return this.setState({ input: '' });
  };

  // onMessageReceived(entry) {
  //   console.log('onMessageReceived:', entry);
  //   this.updateChatHistory(entry);
  // };

  // updateChatHistory(entry) {
  //   this.setState((state) => ({ chatHistory: state.chatHistory.concat(entry) }));
  // };

  // scrollChatToBottom() {
  //   this.panel.scrollTo(0, this.panel.scrollHeight);
  // };

  render() {
    const { chatHistory, input } = this.state;
    return (
      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Enter a message."
          value={input}
          onChange={this.onInput}
          onKeyPress={(e) => (e.key === 'Enter' ? this.onSendMessage() : null)}
        />
        {
          this.props.rightItems
        }
      </div>
    );
  }
}