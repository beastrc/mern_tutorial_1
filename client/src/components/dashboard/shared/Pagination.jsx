import React from 'react';
import classNames from 'classnames'

export default class Pagination extends React.Component {
  constructor (props) {
    super(props);

    this.handlePrevClick = this.handlePrevClick.bind(this)
    this.handleNextClick = this.handleNextClick.bind(this)
  }

  handlePrevClick() {
    this.props.onChange(this.props.activePage - 1)
  }
  handleNextClick() {
    this.props.onChange(this.props.activePage + 1)
  }

  render() {
    const {activePage, totalPageCount} = this.props

    return (
      <div className="btn-group pagination-btns">
        <button type = "button" className="btn" onClick={this.handlePrevClick} disabled={activePage === 1}>&lt;</button>
        <button type = "button" className="btn fake-button">Page {activePage} of {totalPageCount}</button>
        <button type = "button" className="btn" onClick={this.handleNextClick} disabled={activePage === totalPageCount}>&gt;</button>
      </div>
    );
  }
}
