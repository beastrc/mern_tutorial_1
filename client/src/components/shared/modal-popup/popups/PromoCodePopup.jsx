import React from 'react';

import { utils } from '../../../../shared/index';

export default class PromoCodePopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.popupObj.code
    };
    this.popupObj = this.props.popupObj;
    this.onChange = this.onChange.bind(this)
  }

  onYesBtnClick() {
    if(this.popupObj.yesBtnAction) {
      this.popupObj.yesBtnAction(this.state.code);
    }
  }

  onNoBtnClick() {
    if(this.popupObj.noBtnAction) {
      this.popupObj.noBtnAction();
    }
  }

  onClearBtnClick() {
    this.setState({code: ''})
  }

  onChange(e) {
    this.setState({code: e.target.value})
  }

  render() {
    return (
      <div className="send-msg-modal release-payment-modal">
        <div className="modal-header p-20 m-0">Promo Code</div>
        <div className="modal-body m-0">
          <p><input className="form-control" onChange={(e) => this.onChange(e)} value={this.state.code}/></p>
        </div>
        <div className="modal-footer">
          <button className="btn-negative btn pull-left" onClick={() => this.onNoBtnClick()}>Cancel</button>
          <button className="btn-primary btn pull-right" onClick={() => this.onYesBtnClick()}>Save</button>
          <button className="yellow-btn btn pull-right" onClick={() => this.onClearBtnClick()}>Clear</button>
        </div>
      </div>
    )
  }
}
