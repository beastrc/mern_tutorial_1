import React from 'react';
// import './ConversationSearch.css';

export default class ConversationSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: ''
    };
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  handleChange(event) {
    event.persist();
    this.setState({
      keyword: event.target.value
    });
  }
  onSearch(event) {
    event.persist();
    if ((event.keyCode == 13 || event.which == 13) && !event.ctrlKey) {
      let keyword = this.state.keyword;
      this.props.onSearchHandle(keyword);
    }
  }

  render() {
    return (
      <div className="conversation-search">
        <input
          type="search"
          className="conversation-search-input"
          placeholder="Search Messages"
          onChange={this.handleChange.bind(this)}
          onKeyPress={this.onSearch.bind(this)}
          value={this.state.keyword}
        />
      </div>
    );
  }
}
