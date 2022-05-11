import React from 'react';

export default class Loader extends React.Component {
  render() {
    return (
      <div id="legably_loader" className='fade-layer hide'>
        <div className="loader"></div>
      </div>
    );
  }
}
