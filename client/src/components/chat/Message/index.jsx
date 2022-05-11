import React from 'react';
import moment from 'moment';
// import './Message.css';

export default class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friendlyTimestamp: moment(props.data.timestamp).format('LLLL'),
    };
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const {
      data,
      isMine,
      startsSequence,
      endsSequence,
      showTimestamp
    } = this.props;
    return (
      <div className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {
          showTimestamp &&
          <div className="timestamp">
            {this.state.friendlyTimestamp}
          </div>
        }

        <div className="bubble-container">
          <div className="bubble" title={this.state.friendlyTimestamp}>
            {data.message}
          </div>
        </div>
      </div>
    );
  }
}