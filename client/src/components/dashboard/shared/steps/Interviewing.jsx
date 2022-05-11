import React from 'react';
import { Link } from 'react-router';
// import { Truncate } from 'react-read-more';
import ReadMoreReact from 'read-more-react';
import { config, constant, helper, utils } from '../../../../shared/index';
import ModalPopup from '../../../shared/modal-popup/ModalPopup';
let classNames = require('classnames');

export default class Interviewing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepRelatedData: props.stepRelatedData,
      highestStep: props.highestStep,
      modalPopupObj: {},
      freezeActivity: props.freezeActivity || false
    };
    this.updateCandidateJobStatus = this.updateCandidateJobStatus.bind(this);
    this.onDeclineBtnClick = this.onDeclineBtnClick.bind(this);
    this.onNegotiateTermsBtnClick = this.onNegotiateTermsBtnClick.bind(this);
    this.onSendMsgBtnClick = this.onSendMsgBtnClick.bind(this);
    this.onStartChatBtnClick = this.onStartChatBtnClick.bind(this);
    this.onWithdrawBtnClick = this.onWithdrawBtnClick.bind(this);
    this.profileImgError = this.profileImgError.bind(this);
  }

  getPhotoUrl(imgPath) {
    let photoUrl = constant['IMG_PATH'] + 'default-profile-pic.png';
    if (imgPath) {
      let apiConfig = config.getConfiguration();
      photoUrl = apiConfig.S3_BUCKET_URL + imgPath;
    }
    return photoUrl;
  }

  getPracticeAreas(pAreasArr) {
    let arr = utils
      .getListDataRelatedToIds('practice_areas', pAreasArr)
      .map(function(item) {
        return item.name;
      });
    let len = arr.length;

    return len > 0 ? (
      <div className="col-sm-4">
        <span className="d-inline-block truncate-80">
          <i className="fa fa-bookmark" aria-hidden="true"></i>
          {arr.slice(0, 2).join(', ')}
        </span>
        {len > 2 ? (
          <span className="d-inline-block v-bottom"> +{len - 2}</span>
        ) : null}
      </div>
    ) : null;
  }

  getLocations(statesArr) {
    let arr = utils
      .getListDataRelatedToIds('states', statesArr)
      .map(function(item) {
        return item.name;
      });
    let len = arr.length;

    return len > 0 ? (
      <div className="col-sm-4">
        <span className="d-inline-block truncate-80">
          <i className="fa fa-bookmark" aria-hidden="true"></i>
          {arr.slice(0, 2).join(', ')}
        </span>
        {len > 2 ? (
          <span className="d-inline-block v-bottom"> +{len - 2}</span>
        ) : null}
      </div>
    ) : null;
  }

  onDeclineBtnClick(jobId, action, userId, index) {
    helper.openDeclineCandidatePopup(this, () => {
      this.updateCandidateJobStatus(jobId, action, userId, index);
    });
  }

  onNegotiateTermsBtnClick(jobId, action, userId, index) {
    if (this.state.highestStep > constant['JOB_STEPS']['INTERVIEWING']) {
      helper.openInfoMessagePopup(this, 'CANDIDATE_IN_NEGOTIATING_TERM');
    } else {
      this.updateCandidateJobStatus(jobId, action, userId, index);
    }
  }

  onSendMsgBtnClick(userId) {
    helper.openSendMessagePopup(this, userId);
  }

  onStartChatBtnClick(jobId, seekerId) {
    let that = this;
    // helper.makeChatRoom(this, jobId, userId);
    console.log(jobId);
    console.log(seekerId);
    utils.apiCall('GET_JOB_STATUS', { params: [jobId, seekerId] }, function(
      err,
      response
    ) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Job Status');
        utils.logger('error', 'Get Job Status Error -->', er);
      } else {
        if (utils.isResSuccess(response)) {
          let responseData = utils.getDataFromRes(response);
          let jobRecords = responseData.job_status;
          console.log(jobRecords);
          const req = {
            job_status: jobRecords._id,
            user_seeker: seekerId,
            room_title: jobRecords.job_id.jobHeadline
          };

          utils.apiCall(
            'CREATE_CHAT_ROOM',
            { data: req },
            (c_err, c_response) => {
              if (c_err) {
                utils.flashMsg('show', 'Error while creating chat room');
                utils.logger('error', 'Save rating error -->', c_err);
                window.location.replace('/messages');
              } else {
                if (utils.isResSuccess(c_response)) {
                  window.location.replace('/messages');
                }
              }
            }
          );
          console.log(responseData);
        } else {
          utils.logger('warn', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  onWithdrawBtnClick(jobId, action, userId, withdrawBy) {
    helper.openDeclineCandidatePopup(
      this,
      () => {
        this.updateCandidateJobStatus(jobId, action, userId, null);
      },
      withdrawBy
    );
  }

  updateCandidateJobStatus(jobId, action, userId, index) {
    let that = this;
    let req = {
      job_id: jobId,
      status: action,
      freeze_activity: that.state.freeze_activity
    };
    if (that.props.role !== constant['ROLE']['SEEKER']) {
      req.freeze_activity = that.state.stepRelatedData[index].freeze_activity;
    }
    index !== null && (req['user_id'] = userId);
    utils.apiCall('UPDATE_JOB_STATUS', { data: req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while performing this action');
        utils.logger('error', 'Update Job Status Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let hStep = utils.getDataFromRes(
            response,
            'current_highest_job_step'
          );
          if (index === null) {
            let stepData = [];
            stepData.push({
              declined_by: constant['ROLE']['SEEKER']
            });
            that.setState({
              highestStep: req['status'],
              stepRelatedData: stepData
            });
          } else {
            that.state.stepRelatedData.splice(index, 1);
            if (
              that.state.stepRelatedData.length > 0 ||
              hStep > constant['JOB_STEPS']['INTERVIEWING']
            ) {
              that.setState({
                highestStep: hStep,
                stepRelatedData: that.state.stepRelatedData
              });
            }
          }
          that.props.handler(req['status'], hStep);
        } else if (utils.isResConflict(response)) {
          helper.openConflictPopup(that);
        } else if (utils.isResBarIdValid(response)) {
          helper.openBarIdInvalidPopup(that);
        } else if (
          response['data']['code'] ===
          constant['HTTP_STATUS_CODES']['UNPROCESSABLE']
        ) {
          helper.openInfoMessagePopup(that, 'CANDIDATE_IN_NEGOTIATING_TERM');
        } else if (utils.isResLocked(response)) {
          let key =
            that.props.role === constant['ROLE']['SEEKER']
              ? 'ACCOUNT_FROZEN_SEEKER'
              : 'ACCOUNT_FROZEN_POSTER';
          helper.openFreezeActivityPopup(that, key);
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  userDetailLink(userId) {
    let routesPath = constant['ROUTES_PATH'];
    return {
      pathname: routesPath['PROFILE'] + '/' + userId,
      state: {
        jobId: this.props.jobId
      }
    };
  }

  profileImgError(evt) {
    return utils.onImgError(evt, '/images/default-profile-pic.png');
  }

  render() {
    let stepRelatedData = this.state.stepRelatedData,
      jobId = this.props.jobId,
      highestStep = this.state.highestStep;
    let withdrawBtnSeeker = classNames({
      'btn-grey btn': true,
      'seized-btn': false
    });
    if (this.props.role === constant['ROLE']['SEEKER']) {
      withdrawBtnSeeker = classNames({
        'btn-grey btn': true,
        'seized-btn': this.state.freezeActivity
      });
    }

    return (
      <div>
        {this.props.role === constant['ROLE']['SEEKER'] ? (
          highestStep === constant['JOB_STEPS']['INTERVIEWING'] * -1 ? (
            <div className="status-content mt-45">
              {stepRelatedData[0].declined_by === constant['ROLE']['SEEKER']
                ? constant['MESSAGES']['DECLINED_BY_CANDIDATE']
                : constant['MESSAGES']['DECLINED_BY_HIRING_MANAGER']}
            </div>
          ) : (
            <div className="status-content mt-45">
              <h6>Congratulations!</h6>
              <p>
                The hiring manager for this position is interested in discussing
                the role with you.
              </p>
              <p>
                Get started by reaching out via the Legably messaging system.
              </p>
              {highestStep < 0 ? null : (
                <div className="btns text-right">
                  {highestStep >
                  constant['JOB_STEPS']['INTERVIEWING'] ? null : (
                    <button
                      type="button"
                      className={withdrawBtnSeeker}
                      onClick={this.onWithdrawBtnClick.bind(
                        this,
                        jobId,
                        constant['JOB_STEPS']['INTERVIEWING'] * -1,
                        null,
                        constant['ROLE']['SEEKER']
                      )}
                    >
                      Withdraw From Consideration
                    </button>
                  )}
                  {highestStep ===
                  constant['JOB_STEPS']['J_COMPLETE'] ? null : (
                    <button
                      className="btn btn-primary pull-right"
                      onClick={this.onSendMsgBtnClick.bind(this, null)}
                    >
                      Send Message
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="status-content mt-45">

            {
              stepRelatedData.length ?
                <div className="candidates-applied">
                  <h6 className="mb-30">You are interviewing the following attorneys.</h6>
                  {
                    stepRelatedData.map((item, index) => (
                      <div key={index} className="candidate-data">
                        <div className="pull-left pr-30">
                          <img src={this.getPhotoUrl(item.job_seeker_info.network.photo)} alt="profile-img" onError={this.profileImgError} />
                        </div>
                        <div className="right-panel p-0">
                          <div className="row m-0">
                            <Link to={this.userDetailLink(item._id)} className="job-title mb-10">
                              {item.first_name + ' ' + item.last_name}
                            </Link>
                          </div>
                          <div className="row sub-titles">
                            {
                              this.getPracticeAreas(item.job_seeker_info.basic_profile.practice_area_id)
                            }
                            {
                              this.getLocations(item.job_seeker_info.job_profile.willing_to_work_location_id)
                            }
                            <span className="clearfix"></span>
                          </div>
                          <div className="para mt-10 mb-20" style={{color: '#666666'}}>
                            <ReadMoreReact 
                              text={item.job_seeker_info.network.about_lawyer}
                              min={80}
                              ideal={300}
                              max={500}
                              readMoreText="read more"/>
                           {/* <Truncate lines={2} ellipsis={<span>... <Link className="more" to={this.userDetailLink(item._id)}>more</Link></span>}>
                              {item.job_seeker_info.network.about_lawyer}
                            </Truncate>*/}
                          </div>
                          <div className="buttons text-right">
                            <Link to={this.userDetailLink(item._id)}>
                              <button type="button" className="btn btn-primary">
                                View Profile
                              </button>
                            </Link>
                            <button type="button" className={item.freeze_activity ? "btn btn-primary seized-btn" : "btn btn-primary"} onClick={this.onDeclineBtnClick.bind(this, jobId, (constant['JOB_STEPS']['INTERVIEWING'] * -1), item._id, index)}>
                              decline
                            </button>
                            <button type="button" className="btn btn-primary" onClick={this.onSendMsgBtnClick.bind(this, item._id)}>
                              Send Message
                            </button>
                            <button type="button" className={item.freeze_activity ? "btn btn-primary seized-btn" : "btn btn-primary"} onClick={this.onNegotiateTermsBtnClick.bind(this, jobId, constant['JOB_STEPS']['N_TERMS'], item._id, index)}>
                              Negotiate Terms
                            </button>
                          </div>
                        </div>

            {stepRelatedData.length ? (
              <div className="candidates-applied">
                <h6 className="mb-30">
                  You are interviewing the following attorneys.
                </h6>
                {stepRelatedData.map((item, index) => (
                  <div key={index} className="candidate-data">
                    <div className="pull-left pr-30">
                      <img
                        src={this.getPhotoUrl(
                          item.job_seeker_info.network.photo
                        )}
                        alt="profile-img"
                        onError={this.profileImgError}
                      />
                    </div>
                    <div className="right-panel p-0">
                      <div className="row m-0">
                        <Link
                          to={this.userDetailLink(item._id)}
                          className="job-title mb-10"
                        >
                          {item.first_name + ' ' + item.last_name}
                        </Link>
                      </div>
                      <div className="row sub-titles">
                        {this.getPracticeAreas(
                          item.job_seeker_info.basic_profile.practice_area_id
                        )}
                        {this.getLocations(
                          item.job_seeker_info.job_profile
                            .willing_to_work_location_id
                        )}

                        <span className="clearfix"></span>
                      </div>
                      <p className="para mt-10 mb-20">
                        <Truncate
                          lines={2}
                          ellipsis={
                            <span>
                              ...{' '}
                              <Link
                                className="more"
                                to={this.userDetailLink(item._id)}
                              >
                                more
                              </Link>
                            </span>
                          }
                        >
                          {item.job_seeker_info.network.about_lawyer}
                        </Truncate>
                      </p>
                      <div className="buttons text-right">
                        <Link to={this.userDetailLink(item._id)}>
                          <button type="button" className="btn btn-primary">
                            View Profile
                          </button>
                        </Link>
                        <button
                          type="button"
                          className={
                            item.freeze_activity
                              ? 'btn btn-primary seized-btn'
                              : 'btn btn-primary'
                          }
                          onClick={this.onDeclineBtnClick.bind(
                            this,
                            jobId,
                            constant['JOB_STEPS']['INTERVIEWING'] * -1,
                            item._id,
                            index
                          )}
                        >
                          decline
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={this.onSendMsgBtnClick.bind(this, item._id)}
                        >
                          Send Message
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={this.onStartChatBtnClick.bind(
                            this,
                            jobId,
                            item._id
                          )}
                        >
                          Start Live Chat
                        </button>
                        <button
                          type="button"
                          className={
                            item.freeze_activity
                              ? 'btn btn-primary seized-btn'
                              : 'btn btn-primary'
                          }
                          onClick={this.onNegotiateTermsBtnClick.bind(
                            this,
                            jobId,
                            constant['JOB_STEPS']['N_TERMS'],
                            item._id,
                            index
                          )}
                        >
                          Negotiate Terms
                        </button>
                      </div>
                    </div>
                    <span className="clearfix"></span>
                  </div>
                ))}
              </div>
            ) : (
              <div>You are not interviewing any candidate.</div>
            )}
          </div>
        )}
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div>
    );
  }
}
