import React from 'react';

import { utils } from '../../../../shared/index';

export default class ReleasePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.popupObj = this.props.popupObj;
  }

  onYesBtnClick() {
    if(this.popupObj.yesBtnAction) {
      this.popupObj.yesBtnAction();
    }
  }

  onNoBtnClick() {
    if(this.popupObj.noBtnAction) {
      this.popupObj.noBtnAction();
    }
  }

  getFormattedAmount(amount) {
    return utils.getFormattedAmount(amount);
  }

  render() {
    let summaryDetails = this.popupObj.summaryDetails;
    return (
      <div className="send-msg-modal release-payment-modal">
        <div className="modal-header p-20 m-0">Release Payment</div>
        <div className="modal-body m-0">
          <p>By clicking the Release Payment button below, you agree to instruct Stripe Connect to transfer funds currently held in stripe to the seller and complete this milestone.</p>
          <div className="payment-table table">
            <h3 className="table-head">Summary</h3>
            <div className="table-body">
              <div className="table-row">
                <h3 className="half-width d-inline-block">milestone</h3>
                <p className="half-width d-inline-block">{summaryDetails.milestone}</p>
              </div>
              <div className="table-row">
                <h3 className="half-width d-inline-block">status</h3>
                <p className="half-width d-inline-block">delivered</p>
              </div>
              <div className="table-row">
                <h3 className="half-width d-inline-block">amount</h3>
                <p className="half-width d-inline-block">${this.getFormattedAmount(summaryDetails.rate)}</p>
              </div>
              <div className="table-row">
                <h3 className="half-width d-inline-block">order number</h3>
                <p className="half-width d-inline-block">{summaryDetails._id}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-negative btn pull-left" onClick={() => this.onNoBtnClick()}>Cancel</button>
          <button className="yellow-btn btn pull-right" onClick={() => this.onYesBtnClick()}>Release Payment</button>
        </div>
      </div>
    )
  }
}
