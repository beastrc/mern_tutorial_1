import constant from './constant';
import utils from './utils';

const _openInfoOrSuccessMsgPopup = (
  self,
  key,
  imgName,
  cb,
  alignTextLeft = false
) => {
  let popupType = constant['POPUP_TYPES']['INFO'];
  self.setState(
    {
      modalPopupObj: {
        type: popupType,
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/' + imgName,
        msg: constant['POPUP_MSG'].hasOwnProperty(key)
          ? constant['POPUP_MSG'][key]
          : key,
        alignTextLeft: alignTextLeft,
        yesBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
          utils.isFunction(cb) && cb();
        }
      }
    },
    function() {
      utils.modalPopup(popupType, 'show', self);
    }
  );
};

const openInfoMessagePopup = (self, msgKey) => {
  _openInfoOrSuccessMsgPopup(self, msgKey, 'info-alert-icon.svg');
};

const openSuccessMessagePopup = (self, msgKey, callback, alignTextLeft) => {
  _openInfoOrSuccessMsgPopup(
    self,
    msgKey,
    'positive-alert-icon.svg',
    callback,
    alignTextLeft
  );
};

const openNegativeInfoMessagePopup = (
  self,
  msgKey,
  callback,
  alignTextLeft
) => {
  _openInfoOrSuccessMsgPopup(
    self,
    msgKey,
    'negative-alert-icon.svg',
    callback,
    alignTextLeft
  );
};

const openIncompleteProfilePopup = (self, profileName) => {
  let popupType = constant['POPUP_TYPES']['CONFIRM'];
  self.setState(
    {
      modalPopupObj: {
        type: popupType,
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/info-alert-icon.svg',
        msg:
          profileName === 'poster'
            ? constant['POPUP_MSG']['INCOMPLETE_POST_PROFILE']
            : constant['POPUP_MSG']['INCOMPLETE_SEEKER_PROFILE'],
        noBtnText: 'Cancel',
        yesBtnText: 'Complete Profile',
        noBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
        },
        yesBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
          utils.moveToLastUpdatedEditProfilePage(profileName === 'seeker');
        }
      }
    },
    function() {
      utils.modalPopup(popupType, 'show', self);
    }
  );
};

const openDeclineCandidatePopup = (self, callback, withdrawBy) => {
  let popupType = constant['POPUP_TYPES']['CONFIRM'];
  let msgKey = 'DECLINE_CANDIDATE';
  if (withdrawBy) {
    msgKey =
      withdrawBy === constant['ROLE']['POSTER']
        ? 'WITHDRAW_BY_POSTER'
        : 'WITHDRAW_BY_SEEKER';
  }
  self.setState(
    {
      modalPopupObj: {
        type: popupType,
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/negative-alert-icon.svg',
        msg:
          constant['POPUP_MSG']['CONFIRM_MSG'] + constant['POPUP_MSG'][msgKey],
        noBtnText: 'Cancel',
        noBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
        },
        yesBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
          callback();
        }
      }
    },
    function() {
      utils.modalPopup(popupType, 'show', self);
    }
  );
};

const openSendMessagePopup = (self, seekerId, isInvite = false) => {
  let popupType = constant['POPUP_TYPES']['SEND_MSG'];

  const defaultYesBtnAction = function(subject, msg, fileObj) {
    let sendMsgObj = {
      role: self.props.role,
      jobId: self.props.jobId,
      seekerId: seekerId,
      subject: subject,
      message: msg,
      file: Object.keys(fileObj).length ? fileObj : null
    };
    _sendMessage(self, popupType, sendMsgObj);
  };

  const inviteYesBtnAction = function(subject, msg, jobId) {
    let sendMsgObj = {
      role: 'poster',
      seekerId: seekerId,
      subject,
      message: msg,
      jobId,
      isInvite
    };

    _sendMessage(self, popupType, sendMsgObj);
  };

  self.setState(
    {
      modalPopupObj: {
        type: popupType,
        role: seekerId
          ? constant['ROLE']['POSTER']
          : constant['ROLE']['SEEKER'],
        isInvite,
        noBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
        },
        yesBtnAction: isInvite ? inviteYesBtnAction : defaultYesBtnAction
      }
    },
    function() {
      utils.modalPopup(popupType, 'show', self);
    }
  );
};

const _sendMessage = (self, popupType, sendMsgObj) => {
  utils.apiCall('SEND_MESSAGE', { data: sendMsgObj }, function(err, response) {
    if (err) {
      utils.flashMsg('show', 'Error while sending Message');
      utils.logger('error', 'Send Msg Error -->', err);
    } else {
      if (utils.isResSuccess(response)) {
        utils.modalPopup(popupType, 'hide', self);
        setTimeout(() => {
          openSuccessMessagePopup(self, 'SEND_MSG_SUCCESS');
        }, 600);
      } else {
        utils.flashMsg('show', utils.getServerErrorMsg(response));
      }
    }
  });
};

const openSubmitDeliverablePopup = (self, role, paymentDetails, cb) => {
  let popupType = constant['POPUP_TYPES']['SUBMIT_DELIVERABLE'];
  self.setState(
    {
      modalPopupObj: {
        type: popupType,
        size: 'lg',
        role: role,
        paymentDetails: paymentDetails,
        yesBtnText:
          role === constant['ROLE']['SEEKER'] ? 'SEND FILE' : 'APPROVE',
        noBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
        },
        yesBtnAction: function(jobObj) {
          utils.apiCall('UPDATE_DELIVERABLE_STATUS', { data: jobObj }, function(
            err,
            response
          ) {
            if (err) {
              utils.flashMsg('show', 'Error while performing this action');
              utils.logger('error', 'Update Deliverable Status Error -->', err);
            } else {
              if (utils.isResSuccess(response)) {
                utils.modalPopup(popupType, 'hide', self);
                let deliverableStatus = jobObj['status'];
                let deliverableMsgKey = 'DELIVERABLE_SEND_SUCCESS';
                if (role === constant['ROLE']['POSTER']) {
                  deliverableMsgKey =
                    deliverableStatus ===
                    constant['DELIVERABLE_STATUS']['DECLINED']
                      ? 'DELIVERABLE_REJECT_SUCCESS'
                      : 'DELIVERABLE_APPROVE_SUCCESS';
                }
                setTimeout(() => {
                  openSuccessMessagePopup(self, deliverableMsgKey, () => {
                    let resData = utils.getDataFromRes(response) || {};
                    utils.isFunction(cb) &&
                      cb(
                        self.props.stepRelatedData['data'],
                        paymentDetails['paymentDetails'],
                        deliverableStatus,
                        resData['job_completed'],
                        resData['url'] || ''
                      );
                  });
                }, 600);
              } else {
                utils.flashMsg('show', utils.getServerErrorMsg(response));
              }
            }
          });
        }
      }
    },
    function() {
      utils.modalPopup(popupType, 'show', self);
    }
  );
};

const openConflictPopup = (self, cb = null) => {
  if (cb === null) {
    cb = () => {
      utils.refreshPage();
    };
  }
  setTimeout(() => {
    openNegativeInfoMessagePopup(self, 'CONFLICT', cb);
  }, 400);
};

const openBarIdInvalidPopup = self => {
  openNegativeInfoMessagePopup(self, 'INVALID_BAR_ID');
};

const openEmailVerificationRequiredPopup = (self, msgKey, emailId) => {
  let popupType = constant['POPUP_TYPES']['CONFIRM'];
  self.setState(
    {
      modalPopupObj: {
        type: popupType,
        iconImgUrl: constant['IMG_PATH'] + 'svg-images/lock-icon.svg',
        msg: constant['POPUP_MSG'][msgKey],
        dynamicContent: [
          {
            key: 'emailAddress',
            value: emailId
          }
        ],
        noBtnText: 'Cancel',
        yesBtnText: 'Resend Email',
        noBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
        },
        yesBtnAction: function() {
          _resendEmail(self, popupType, emailId);
        }
      }
    },
    function() {
      setTimeout(() => {
        utils.modalPopup(popupType, 'show', self);
      }, 200);
    }
  );
};

const _resendEmail = (self, popupType, emailId) => {
  utils.apiCall('RESEND_EMAIL', { params: [emailId] }, function(err, response) {
    if (err) {
      utils.flashMsg('show', 'Error while sending Email');
      utils.logger('error', 'Resend Email Error -->', err);
    } else {
      if (utils.isResSuccess(response)) {
        utils.modalPopup(popupType, 'hide', self);
        setTimeout(() => {
          openSuccessMessagePopup(self, 'SEND_EMAIL_SUCCESS');
        }, 600);
      } else {
        utils.flashMsg('show', utils.getServerErrorMsg(response));
      }
    }
  });
};

const openFreezeActivityPopup = (self, key) => {
  setTimeout(() => {
    openNegativeInfoMessagePopup(self, key, null, true);
  }, 400);
};

const openTransferFundsPopup = (self, stepRelatedData) => {
  let popupType = constant['POPUP_TYPES']['TRANSFER_FUNDS'];
  self.setState(
    {
      modalPopupObj: {
        type: popupType,
        stepRelatedData: stepRelatedData || {},
        size: 'nl',
        noBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
        },
        yesBtnAction: function(paymentDetails) {
          let req = stepRelatedData;
          req.hours = paymentDetails.hours ? paymentDetails.hours : 0;
          req.subTotal = paymentDetails.subTotal;
          req.total = paymentDetails.total;
          utils.apiCall('UPDATE_HOURLY_FIXED_TERMS', { data: req }, function(
            err,
            response
          ) {
            if (err) {
              utils.flashMsg('show', 'Error while updating Negotiating Terms');
              utils.logger('error', 'Update Negotiating Terms Error -->', err);
            } else {
              if (utils.isResSuccess(response)) {
                req.freeze_activity = utils.getDataFromRes(
                  response,
                  'freeze_activity'
                );
                _transferAndReleaseFunds(self, popupType, req);
              } else if (utils.isResConflict(response)) {
                utils.modalPopup(popupType, 'hide', self);
                setTimeout(() => {
                  openConflictPopup(self);
                }, 600);
              } else if (utils.isResBarIdValid(response)) {
                utils.modalPopup(popupType, 'hide', self);
                setTimeout(() => {
                  openBarIdInvalidPopup(self);
                }, 600);
              } else if (utils.isResLocked(response)) {
                utils.modalPopup(popupType, 'hide', self);
                setTimeout(() => {
                  openFreezeActivityPopup(self, 'ACCOUNT_FROZEN_POSTER');
                }, 600);
              } else {
                utils.flashMsg('show', utils.getServerErrorMsg(response));
              }
            }
          });
        }
      }
    },
    function() {
      utils.modalPopup(popupType, 'show', self);
    }
  );
};

const _transferAndReleaseFunds = (self, popupType, stepRelatedData) => {
  let req = {
    job_id: stepRelatedData.jobId,
    user_id: stepRelatedData.seekerId,
    freeze_activity: stepRelatedData.freeze_activity
  };
  utils.apiCall('TRANSFER_FUNDS', { data: req }, function(err, response) {
    if (err) {
      utils.flashMsg('show', 'Error while transferring Funds');
      utils.logger('error', 'Transfer Funds Error -->', err);
    } else {
      if (utils.isResSuccess(response)) {
        setTimeout(() => {
          let milestoneObj = {
            milestone: stepRelatedData.paymentDetails['milestone'],
            _id: stepRelatedData.paymentDetails['_id']
          };
          _releasePayment(self, popupType, milestoneObj);
        }, 600);
      } else if (utils.isResConflict(response)) {
        utils.modalPopup(popupType, 'hide', self);
        setTimeout(() => {
          openConflictPopup(self);
        }, 600);
      } else if (utils.isResLocked(response)) {
        utils.modalPopup(popupType, 'hide', self);
        setTimeout(() => {
          openFreezeActivityPopup(self, 'ACCOUNT_FROZEN_POSTER');
        }, 600);
      } else {
        utils.flashMsg('show', utils.getServerErrorMsg(response));
      }
    }
  });
};

const openReleasePaymentPopup = (self, summaryDetails) => {
  let popupType = constant['POPUP_TYPES']['RELEASE_PAYMENT'];
  self.setState(
    {
      modalPopupObj: {
        type: popupType,
        size: 'nl',
        summaryDetails: summaryDetails || {},
        noBtnAction: function() {
          utils.modalPopup(popupType, 'hide', self);
        },
        yesBtnAction: function() {
          _releasePayment(self, popupType, summaryDetails);
        }
      }
    },
    function() {
      utils.modalPopup(popupType, 'show', self);
    }
  );
};

const _releasePayment = (self, popupType, milestoneObj) => {
  let reqObj = {
    job_id: self.props.jobId,
    milestone: milestoneObj.milestone,
    milestone_id: milestoneObj._id
  };
  utils.apiCall('RELEASE_FUND', { data: reqObj }, function(err, response) {
    if (err) {
      utils.flashMsg('show', 'Error while releasing fund');
      utils.logger('error', 'Release Fund Error -->', err);
    } else {
      if (utils.isResSuccess(response)) {
        utils.modalPopup(popupType, 'hide', self);
        setTimeout(() => {
          openSuccessMessagePopup(self, 'RELEASE_PAYMENT_SUCCESS');
        }, 600);
      } else {
        utils.flashMsg('show', utils.getServerErrorMsg(response));
      }
    }
  });
};

const closeLeftPanel = () => {
  $('.header-wrapper').removeClass('fade-layer-before');
  $('#sidebar').removeClass('slide-show mobile-menu');
  $('.main-nav:visible').removeClass('cross-icon');
};

const getValidationMsg = (key, dynamicContent = {}) => {
  let message = constant['VALIDATION_MSG'][key];

  for (let key in dynamicContent) {
    let regExp = new RegExp('{' + key + '}', 'g');
    message = message.replace(regExp, dynamicContent[key]);
  }

  return message;
};

module.exports = {
  openInfoMessagePopup,
  openSuccessMessagePopup,
  openNegativeInfoMessagePopup,
  openIncompleteProfilePopup,
  openDeclineCandidatePopup,
  openSendMessagePopup,
  openSubmitDeliverablePopup,
  openConflictPopup,
  openBarIdInvalidPopup,
  openEmailVerificationRequiredPopup,
  openFreezeActivityPopup,
  openReleasePaymentPopup,
  openTransferFundsPopup,
  closeLeftPanel,
  getValidationMsg
};
