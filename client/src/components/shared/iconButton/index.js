import React from 'react';
// import './ToolbarButton.css';

export default function IconButton(props) {
  const { icon } = props;
  return (
    <i className={`icon-button ${icon}`} />
  );
}