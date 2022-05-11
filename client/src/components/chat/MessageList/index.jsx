import React from 'react';
import Compose from '../Compose';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import Message from '../Message';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import io from 'socket.io-client';
import { config, constant, helper, utils } from '../../../shared/index';

// import './MessageList.css';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    let apiConfig = config.getConfiguration();
    this.socket = io(apiConfig.API_ENDPOINT);
    this.state = {
      messages: [
        {
          id: 1,
          senderId: 'apple',
          message:
            'Hello world! This is a long message that will hopefully get wrapped by our message bubble component! We will see how well it works.',
          timestamp: new Date().getTime()
        }
      ],
      myId: ''
    };
    this.renderMessages = this.renderMessages.bind(this);
  }
  componentDidMount() {
    var _this = this;
    this.socket.on('connect', () => {
      console.log('Socket connected FROM React...');
      // emit all the room ids where the user belongs to see him / her as active
      this.socket.emit('onlineUser', this.props.ChatRoom.senderId);
    });
    // when a user is online
    this.socket.on('onlineUser', data => {
      console.log('these rooms should be shown as online', data);
      onLineRoom(data);
    });
    this.socket.on('disconnect', () => {
      console.log('disconnected.. .!!');
    });
  }

  componentWillReceiveProps(nextProps) {
    var _this = this;
    if (nextProps.ChatRoom.id !== undefined) {
      if (this.props.ChatRoom.receiverId !== undefined) {
        this.socket.off(
          this.props.ChatRoom.receiverId + ':' + this.props.ChatRoom.senderId
        );
      }
      //if(this.state.myId !== nextProps.ChatRoom.senderId){

      this.socket.on(
        nextProps.ChatRoom.receiverId + ':' + nextProps.ChatRoom.senderId,
        data => {
          console.log('data value ', data);
          _this.onNewMessageReceived(data);
        }
      );
      //}

      this.setState({ myId: nextProps.ChatRoom.senderId });

      let params = {
        chatroom: nextProps.ChatRoom.id
      };
      utils.apiCall('GET_MESSAGES', { get_params: params }, function(
        err,
        response
      ) {
        if (err) {
          utils.flashMsg('show', 'Error while getting chat rooms');
          utils.logger('error', 'Get chat room error -->', err);
        } else {
          _this.setState({ messages: [...response.data] }, () => {
            _this.scrollToLastMessage();
          });
        }
      });
    }
  }

  onNewMessageReceived(msgObj) {
    var messages = this.state.messages;
    messages.push(msgObj);
    var _this = this;
    this.setState({ messages: messages }, () => {
      _this.scrollToLastMessage();
    });
  }

  onNewMessageArrival(data) {
    const newMessage = {
      id: uuidv4(),
      chatroom: this.props.ChatRoom.id,
      senderId: this.props.ChatRoom.senderId,
      receiverId: this.props.ChatRoom.receiverId,
      message: data,
      timestamp: new Date().getTime()
    };
    //create new message in db
    utils.apiCall(
      'CREATE_MESSAGE',
      { data: newMessage },
      (c_err, c_response) => {
        if (c_err) {
          utils.flashMsg('show', 'Error while creating message');
          utils.logger('error', 'Save rating error -->', c_err);
        } else {
          if (utils.isResSuccess(c_response)) {
          }
        }
      }
    );

    this.socket.emit('message', newMessage); //send message to server
    var messages = this.state.messages;
    messages.push(newMessage);
    var _this = this;
    this.setState({ messages: messages }, () => {
      _this.scrollToLastMessage();
    });
  }
  scrollToLastMessage() {
    var els = document.getElementsByClassName('message');
    if (els.length > 0) {
      els[els.length - 1].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }

  renderMessages() {
    let i = 0;
    let messages = this.state.messages;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.senderId === this.props.ChatRoom.senderId;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.senderId === current.senderId;

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('seconds') < 60) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.senderId === current.senderId;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  }

  render() {
    return (
      <div className="message-list">
        <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton
              key="info"
              icon="ion-ios-information-circle-outline"
            />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        />

        <div className="message-list-container">{this.renderMessages()}</div>

        <Compose
          onNewMessageArrival={this.onNewMessageArrival.bind(this)}
          rightItems={[
            <ToolbarButton key="photo" icon="ion-ios-camera" />,
            <ToolbarButton key="image" icon="ion-ios-image" />,
            <ToolbarButton key="audio" icon="ion-ios-mic" />,
            <ToolbarButton key="money" icon="ion-ios-card" />,
            <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
            <ToolbarButton key="emoji" icon="ion-ios-happy" />
          ]}
        />
      </div>
    );
  }
}
