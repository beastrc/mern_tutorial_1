import React from 'react';

export default class NoRecordFound extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const record = this.props.name || 'Records'
    return (
      <div className="job-search-card under-construction">
        <div className="text-center">No {record} Found</div>
      </div>
    );
  }
}
