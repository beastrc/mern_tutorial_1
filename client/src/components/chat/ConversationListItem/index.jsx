import React, { useEffect } from 'react';
import { constant, utils } from '../../../shared/index';
// import './ConversationListItem.css';

export default class ConversationListItem extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const { photo, name, text, type } = this.props.data;
    return (
      <div
        className={
          this.props.selected
            ? 'conversation-list-item selected'
            : 'conversation-list-item'
        }
        onClick={e => this.props.clickChatRoom(this.props.roomIndex)}
      >
        <img className="conversation-photo" src={photo} alt="conversation" />
        <div className="conversation-info">
          <h3 className="conversation-type">{type}</h3>
          <h1 className="conversation-title">{name}</h1>
          <p className="conversation-snippet">{text}</p>
        </div>
      </div>
    );
  }
}
