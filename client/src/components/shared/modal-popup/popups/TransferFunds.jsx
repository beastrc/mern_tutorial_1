import React from 'react';

import { utils, constant } from '../../../../shared/index';

export default class TransferFunds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentDetails: {rate: '', rateType: '', hours: '', subTotal: '', total: '', currentRate: ''},
      formError: {hours: '', subTotal: ''},
    };
    this.popupObj = this.props.popupObj;

  }

  componentDidMount() {
    this.getServiceCharge();
  }

  getServiceCharge(){
    let that = this;
    utils.apiCall('GET_SERVICE_CHARGE', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Service Charge');
        utils.logger('error', 'Get Service Charge Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);
          var stateObj = that.state.paymentDetails;
          stateObj.currentRate = Number(data['service_charge']);
          that.setState({paymentDetails: stateObj}, function() {
            this.setPaymentDetails();
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  setPaymentDetails() {
    let paymentInfo = this.props.popupObj.stepRelatedData,
    paymentDetails = this.state.paymentDetails;
    let rate = paymentInfo['rate'];
    rate && (paymentDetails['rate'] = rate);
    let rateType = paymentInfo['rateType'];
    rateType && (paymentDetails['rateType'] = rateType);
    if (rateType == utils.ENUM.RATE_TYPE.FIXED) {
      paymentDetails['subTotal'] = rate;
      let total = parseFloat(rate) + parseFloat(parseFloat(rate * paymentDetails.currentRate / 100).toFixed(2));
      total && (paymentDetails['total'] = total);
    } 
    this.setState({
      paymentDetails: paymentDetails
    });
  }
  
  validateAndCalculateAmount (ev, key, limit) {
    this.validateLength(ev, key, limit);
    this.calculateAmount();
  }

  validateLength (ev, key, maxValue) {
    var val = ev.target.value + '';
    var maxLen = String(maxValue).length;
    if (ev.target.name !== 'zipCode') {
      val = val.replace(/[^0-9.]/g, "");
      val = val.substr(0, (maxValue+'').length);
    }
    var stateObj = this.state.paymentDetails;
    stateObj[key] = val;
    this.setState({paymentDetails: stateObj});
  }

  calculateAmount () {
    var _this = this;
    var paymentDetails = this.state.paymentDetails;
    var formError = this.state.formError;

    setTimeout(function() {
      var subtotal = utils.ENUM.RATE_TYPE.FIXED == paymentDetails.rateType ? (paymentDetails.rate || 0) : (paymentDetails.rate || 0) * (paymentDetails.hours || 0);

      isNaN(subtotal) && (subtotal = 0);
      paymentDetails.subTotal = subtotal;
      formError.subTotal = (paymentDetails.subTotal < 100) ? constant['MIN_JOB_AMOUNT'] : false;
      var total = parseFloat(paymentDetails.subTotal) + parseFloat(parseFloat(paymentDetails.subTotal * paymentDetails.currentRate / 100).toFixed(2));

      paymentDetails.total = total;

      _this.setState({formError});
      _this.setState({paymentDetails: paymentDetails});
    }, 0);
  }

  handleOnBlur (ev, key) {
    var formError = this.state.formError;
    var val = ev.target.value;

    formError[key] = false;

    if (key === 'hours') {
      if (!val) {
        formError[key] = constant['ENTER_HOURS'];
      } else if (!(Number(val))) {
        formError[key] = constant['HOURS_ERROR'];
      }
    } 

    this.setState({formError: formError});
  }

  validateForm () {
    let validForm = true;
    let formError = this.state.formError;
    let paymentDetails = this.state.paymentDetails;
    if (!paymentDetails['hours']) {
      formError['hours'] = constant['ENTER_HOURS'];
      validForm = false;

    } else if (!(Number(paymentDetails['hours']))) {
      formError['hours'] = constant['HOURS_ERROR'];
      validForm = false;
    } else if (paymentDetails['subTotal'] < 100) {
      formError['subTotal'] = constant['MIN_JOB_AMOUNT'];
      validForm = false;
    }
    this.setState({formError: formError});
    return validForm;
  }

  onYesBtnClick() {
    if (this.popupObj.yesBtnAction) {
      if (this.state.paymentDetails['rateType'] != utils.ENUM.RATE_TYPE.FIXED) {
        if(!this.validateForm()) {
          return;
        }
      }
      this.popupObj.yesBtnAction(this.state.paymentDetails);
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
    let paymentDetails = this.state.paymentDetails;
    return (
      <div className="send-msg-modal release-payment-modal">
        <div className="modal-header p-20 m-0">Transfer Funds</div>
        <div className="modal-body m-0">
          <form>
            {paymentDetails.rateType != utils.ENUM.RATE_TYPE.FIXED &&
            <div className="form-group">
              <label className="control-label">HOURLY RATE</label>
              <input className="form-control amount-dollar-bg text-left custom-num" placeholder="Rate" type="text" 
                value={paymentDetails.rate} 
                disabled="true"/>
              {this.state.formError.rate ? <p><span> {this.state.formError.rate} </span></p> : ''}
            </div>
            }

            {paymentDetails.rateType != utils.ENUM.RATE_TYPE.FIXED &&
            <div className={this.state.formError.hours && paymentDetails.rateType != utils.ENUM.RATE_TYPE.FIXED? 'form-group global-error' : 'form-group' }>
              <label className="control-label">HOURS OF WORK*</label>
              <input className="form-control custom-num" placeholder="00" type="text" value={paymentDetails.hours} onChange={(e) => this.validateAndCalculateAmount(e, 'hours', 999)} onBlur={(e) => this.handleOnBlur(e, 'hours')} />
              {this.state.formError.hours ? <p><span> {this.state.formError.hours} </span></p> : ''}
            </div>
            }

            <div className={this.state.formError.subTotal ? 'form-group global-error' : 'form-group' }>
              <label className="control-label">AMOUNT PAYABLE TO ATTORNEY</label>
              <input className="form-control amount-dollar-bg" placeholder="Amount Payable" type="text" value={paymentDetails.subTotal} disabled="true"/>
              {this.state.formError.subTotal ? <p><span> {this.state.formError.subTotal} </span></p> : ''}
            </div>

            <div className="form-group">
              <label className="control-label">LEGABLY SERVICE CHARGE</label>
              <input className="form-control amount-dollar-bg" placeholder="Service Charge" type="text" value={parseFloat(parseFloat(paymentDetails.subTotal * paymentDetails.currentRate / 100).toFixed(2))} disabled="true"/>
            </div>

            <div className="form-group">
              <label className="control-label">TOTAL COST</label>
              <input className="form-control amount-dollar-bg" placeholder="Total Cost" type="text" value={paymentDetails.total} disabled="true"/>
            </div>

          </form>
        </div>
        <div className="modal-footer">
          <button className="btn-negative btn pull-left" onClick={() => this.onNoBtnClick()}>Cancel</button>
          <button className="yellow-btn btn pull-right" onClick={() => this.onYesBtnClick()}>Transfer Funds</button>
        </div>
      </div>
    )
  }
}
