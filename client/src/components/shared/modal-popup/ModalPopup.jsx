import React from 'react';

import {
  Info,
  Confirm,
  ViewFile,
  SendMsg,
  SubmitDeliverable,
  ReleasePayment,
  PromoCodePopup,
  TransferFunds
} from './index';

export default class ModalPopup extends React.Component {
  render() {
    let modalPopupObj = this.props.modalPopupObj;
    return (
      <div
        className="del-photo-modal modal fade in legably-modal p-0"
        id={modalPopupObj.type}
        role="dialog"
        data-backdrop="static"
      >
        <div className={'modal-dialog modal-' + (modalPopupObj.size || 'md')}>
          <div className="modal-content">
            {
              {
                info_popup: <Info popupObj={modalPopupObj} />,
                confirm_popup: <Confirm popupObj={modalPopupObj} />,
                view_file_popup: <ViewFile popupObj={modalPopupObj} />,
                send_msg_popup: <SendMsg popupObj={modalPopupObj} />,
                submit_deliverable_popup: (
                  <SubmitDeliverable popupObj={modalPopupObj} />
                ),
                release_payment_popup: (
                  <ReleasePayment popupObj={modalPopupObj} />
                ),
                promo_code_popup: (
                  <PromoCodePopup popupObj={modalPopupObj} />
                ),
                transfer_funds_popup: <TransferFunds popupObj={modalPopupObj} />
              }[modalPopupObj.type]
            }
          </div>
        </div>
      </div>
    );
  }
}
