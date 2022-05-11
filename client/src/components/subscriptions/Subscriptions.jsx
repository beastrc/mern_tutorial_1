import React from 'react';
// import {useStripe} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Link, browserHistory } from 'react-router';

import { LegablyLargeFooter } from '../index';
import { constant, utils } from '../../shared/index';
import ModalPopup from '../shared/modal-popup/ModalPopup';

// const stripePromise = loadStripe("pk_test_swti9d8WagPHyfv0lb7qdCzF")

export default class Subscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribedPlan: null,
      modalPopupObj: {},
      code: ''
    };

    this.enterPromoCode = this.enterPromoCode.bind(this)
    this.gotoCheckOut = this.gotoCheckOut.bind(this)
    this.cancelSubscription = this.cancelSubscription.bind(this)
    this.changeSubscription = this.changeSubscription.bind(this)
  }

  componentDidMount() {
    let _this = this;
    utils.apiCall('SUBSCRIBED_PLAN', {}, function (err, response) {
      if (err) {
      } else {
        _this.setState({
          subscribedPlan: response.data.plan
        })
      }
    })
  }

  enterPromoCode() {
    let _this = this;
    let popupType = constant['POPUP_TYPES']['PROMO_CODE'];
    _this.setState({
      modalPopupObj: {
        type: popupType,
        code: _this.state.code,
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/positive-alert-icon.svg',
        msg: (status === constant['STATUS']['INACTIVE']) ? constant['POPUP_MSG']['JOB_SAVE_SUCCESS'] : constant['POPUP_MSG']['JOB_POST_SUCCESS'],
        noBtnAction: function () {
          utils.modalPopup(popupType, 'hide', _this);
        },
        yesBtnAction: function (code) {
          utils.modalPopup(popupType, 'hide', _this);
          _this.setState({ code })
        }
      }
    }, function () {
      utils.modalPopup(popupType, 'show', _this);
    });
  }

  gotoCheckOut(key) {
    let _this = this;
    this.props.history.push(constant['ROUTES_PATH']['CHECKOUT'] + '/' + key)
  }

  cancelSubscription() {
    let _this = this;
    let popupType = constant['POPUP_TYPES']['CONFIRM'];
    _this.setState({
      modalPopupObj: {
        type: popupType,
        textarea: true,
        noBtnText: 'Cancel',
        yesBtnText: 'Proceed',
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/negative-alert-icon.svg',
        msg: constant['POPUP_MSG']['CANCEL_SUBSCRIPTION'],
        noBtnAction: function () {
          utils.modalPopup(popupType, 'hide', _this);
        },
        yesBtnAction: function (msg) {
          utils.modalPopup(popupType, 'hide', _this);
          utils.apiCall('CANCEL_SUBSCRIPTION', {
            data: {
              message: msg
            }
          }, function (err, response) {
            if (err) {
              utils.flashMsg('show', err.response.data.error.message);
            } else {
              _this.setState({
                subscribedPlan: response.data.plan
              })
            }
          })
        }
      }
    }, function () {
      utils.modalPopup(popupType, 'show', _this);
    });
  }

  changeSubscription() {

  }

  render() {
    const { subscribedPlan } = this.state
    const planNo = subscribedPlan ? constant['PLANS'].indexOf(subscribedPlan.plan_id) : -1

    const SubscribedRibon = ({ title }) =>
      <div className="ribon">
        <div className="content">
          {title}
        </div>
      </div>

    return (

      <div className="pricing-page">
        <div className="pricing-content">
          <div className="row" style={{ marginTop: 20 }}>
            <div className="col-lg-2" />
            <div className="col-lg-8">
              <h1 className="text-center text-primary"><strong>Select A Subscription</strong></h1>
            </div>
            <div className="col-lg-2">
              <div className="pull-right">
                <button className="btn btn-primary" onClick={() => this.enterPromoCode()}>
                  Enter A Promo Code
                  </button><br />
                <p className="text-center mb-0">
                  {this.state.code ? this.state.code : 'No promo applied'}
                </p>
              </div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 30 }}>
            {
              constant['SUBSCRIPTION_TIERS'].map((subscription, key) =>
                <div className="col-lg-4" key={key}>
                  <div className="card subscription-card">
                    {planNo === key && <SubscribedRibon title={'CURRENTLY SUBSCRIBED'} />}
                    <h2 className="mt-2"><strong>{subscription.title}</strong></h2>
                    <h3>
                      <span className="amount">{subscription.price}</span> {subscription.subtitle}
                    </h3>
                    <div className="separator"></div>
                    <ul className="features">
                      {subscription.details.map((dt, key1) => <li key={key1}>{dt}</li>)}
                    </ul>

                    <button className="btn btn-primary" onClick={() => this.gotoCheckOut(key + 1)}>
                      CHOOSE
                      </button>

                  </div>
                </div>
              )
            }
          </div>
          {
            subscribedPlan &&
            <div className="row" style={{ marginTop: 30, textAlign: 'center' }}>
              <button className="btn btn-primary" style={{ fontSize: 18, padding: '5px 30px' }} onClick={() => this.changeSubscription()}>
                Change My Subscription
              </button>
            </div>
          }
          {
            subscribedPlan &&
            <div className="row" style={{ marginTop: 30, textAlign: 'center' }}>
              <a style={{ fontSize: 16, color: '#ff5722', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => this.cancelSubscription()}>
                Cancel My Subscription
              </a>
            </div>
          }
        </div>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
        {!this.state.token && <LegablyLargeFooter />}
      </div>

    );
  }
}
