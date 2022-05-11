import React from 'react';

import { utils } from '../../../shared/index';

export default class FlashMsg extends React.Component {
  render() {
    return (
      <div id="legably_flash_msg" className="alert alert-danger hide">
        <div id="msg"></div>
        <div className="close-alert" onClick={() => utils.flashMsg('hide')}>x</div>
      </div>
    );
  }
}
