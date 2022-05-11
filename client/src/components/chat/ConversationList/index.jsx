import React from 'react';
import ConversationSearch from '../ConversationSearch';
import ConversationListItem from '../ConversationListItem';
import Toolbar from '../Toolbar';
import ToolbarButton from '../ToolbarButton';
import axios from 'axios';
import { constant, utils } from '../../../shared/index';
// import './ConversationList.css';

export default class ConversationList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div className="conversation-list">
        <Toolbar
          title="Messenger"
          leftItems={[<ToolbarButton key="cog" icon="ion-ios-cog" />]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        />
        <ConversationSearch onSearchHandle={this.props.onSearchHandle} />
        {this.props.conversations.map((conversation, index) => (
          <ConversationListItem
            key={index}
            roomIndex={index}
            data={conversation}
            selected={
              conversation.id === this.props.selectedChatRoom.id ? true : false
            }
            clickChatRoom={this.props.onClickChatRoom}
          />
        ))}
      </div>
    );
  }
}
