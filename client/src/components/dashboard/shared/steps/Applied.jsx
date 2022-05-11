import React from 'react';
import { Link } from 'react-router';
// import { Truncate } from 'react-read-more';
import ReadMoreReact from 'read-more-react';
import moment from 'moment';

import { config, constant, helper, utils } from '../../../../shared/index';
import ModalPopup from '../../../shared/modal-popup/ModalPopup';

export default class Applied extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepRelatedData: props.stepRelatedData || [],
      declinedCandidateList: props.declinedCandidateList || [],
      modalPopupObj: {}
    }
    this.updateCandidateJobStatus = this.updateCandidateJobStatus.bind(this);
    this.onDeclineBtnClick = this.onDeclineBtnClick.bind(this);
    this.profileImgError = this.profileImgError.bind(this);
  }

  getPhotoUrl(imgPath) {
    let photoUrl = constant['IMG_PATH'] + 'default-profile-pic.png';
    if(imgPath) {
      let apiConfig = config.getConfiguration();
      photoUrl = apiConfig.S3_BUCKET_URL + imgPath;
    }
    return photoUrl;
  }

  getPracticeAreas(pAreasArr) {
    let arr = utils.getListDataRelatedToIds('practice_areas', pAreasArr).map(function(item) {
      return item.name;
    });
    let len = arr.length;

    return (
      len > 0 ?
        <div className="col-sm-4">
          <span className="d-inline-block truncate-80">
            <i className="fa fa-bookmark" aria-hidden="true"></i>
            {arr.slice(0, 2).join(", ")}
          </span>
          {len > 2 ? <span className="d-inline-block v-bottom"> +{len - 2}</span> : null }
        </div>
      :
        null
    )
  }

  getLocations(statesArr) {
    let arr = utils.getListDataRelatedToIds('states', statesArr).map(function(item) {
      return item.name;
    });
    let len = arr.length;

    return (
      len > 0 ?
        <div className="col-sm-4">
          <span className="d-inline-block truncate-80">
            <i className="fa fa-bookmark" aria-hidden="true"></i>
            {arr.slice(0, 2).join(", ")}
          </span>
          {len > 2 ? <span className="d-inline-block v-bottom"> +{len - 2}</span> : null }
        </div>
      :
        null
    )
  }

  onDeclineBtnClick(jobId, action, userId, index) {
    helper.openDeclineCandidatePopup(this, () => {
      this.updateCandidateJobStatus(jobId, action, userId, index);
    });
  }

  updateCandidateJobStatus(jobId, action, userId, index) {
    let that = this;
    let req = {
      job_id: jobId,
      status: action,
      user_id: userId,
      freeze_activity: that.state.stepRelatedData[index].freeze_activity
    };
    utils.apiCall('UPDATE_JOB_STATUS', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while performing this action');
        utils.logger('error', 'Update Job Status Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          if (action === constant['JOB_STEPS']['INTERVIEWING']) {
            that.state.stepRelatedData.splice(index, 1);
          } else {
            that.state.stepRelatedData[index]['isDeclined'] = true;
          }
          that.setState({
            stepRelatedData: that.state.stepRelatedData
          });

          that.props.handler(req['status'], utils.getDataFromRes(response, 'current_highest_job_step'));
        } else if (utils.isResConflict(response)) {
          helper.openConflictPopup(that);
        }else if (utils.isResBarIdValid(response)) {
          helper.openBarIdInvalidPopup(that);
        } else if (utils.isResLocked(response)) {
          helper.openFreezeActivityPopup(that, 'ACCOUNT_FROZEN_POSTER');
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
    }
  }

  getDate() {
    let date = new Date();
    let sRelatedData = this.state.stepRelatedData;
    if (sRelatedData.length) {
      date = sRelatedData[0]['created_at'];
    }
    let momentDate = utils.convertUtcToEst(date);

    return (
      <h6 className="">You applied for this job on {momentDate.format(constant['DATE_FORMAT'])} at {momentDate.format('LT')}.</h6>
    )
  }

  profileImgError(evt) {
    return utils.onImgError(evt, '/images/default-profile-pic.png');
  }

  render() {
    let jobId = this.props.jobId,
    stepRelatedData = this.state.stepRelatedData,
    declinedCandidateList = this.state.declinedCandidateList;

    for (let declinedCandidate of declinedCandidateList) {
      declinedCandidate['isDeclined'] = true;
    }
    stepRelatedData = stepRelatedData.concat(declinedCandidateList);

    return (
      <div>

        { this.props.role === constant['ROLE']['SEEKER'] ?
          <div className="status-content mt-45">
          {
            this.getDate()
          }
          {
            this.props.highestStep === (constant['JOB_STEPS']['APPLIED'] * -1) ?
              <p>{constant['MESSAGES']['DECLINED_BY_HIRING_MANAGER']}</p>
            :
              <p>We’ll let you know when the hiring manager for this posting has reviewed your application and decided how to proceed!</p>
          }
          </div>
        :
          <div className="status-content mt-45">
            {
              stepRelatedData.length ?
                <div className="candidates-applied">
                  <h6 className="mb-30">The following attorneys have applied for this job.</h6>
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
{/*
                            <Truncate lines={2} ellipsis={<span>... <Link className="more" to={this.userDetailLink(item._id)}>more</Link></span>}>
                              {item.job_seeker_info.network.about_lawyer}
                            </Truncate>*/}
                          </div>
                          {
                            item.isDeclined ?
                              <div className="buttons text-right">
                                <Link to={this.userDetailLink(item._id)}>
                                  <button type="button" className="btn btn-primary">
                                    View Profile
                                  </button>
                                </Link>
                                <button type="button" className="btn btn-grey-disabled" disabled>
                                  {(item.declined_by === constant['ROLE']['SEEKER'] ? 'Candidate ' : '') + 'declined'}
                                </button>
                              </div>
                            :
                              item.freeze_activity ?
                                <div className="buttons text-right">
                                  <Link to={this.userDetailLink(item._id)}>
                                    <button type="button" className="btn btn-primary">
                                      View Profile
                                    </button>
                                  </Link>
                                  <button type="button" className="btn btn-primary seized-btn" onClick={this.onDeclineBtnClick.bind(this, jobId, (constant['JOB_STEPS']['APPLIED'] * -1), item._id, index)}>
                                    decline
                                  </button>
                                  <button type="button" className="btn btn-primary seized-btn" onClick={this.updateCandidateJobStatus.bind(this, jobId, constant['JOB_STEPS']['INTERVIEWING'], item._id, index)}>
                                    Interview
                                  </button>
                                  </div>
                              :
                                <div className="buttons text-right">
                                  <Link to={this.userDetailLink(item._id)}>
                                    <button type="button" className="btn btn-primary">
                                      View Profile
                                    </button>
                                  </Link>
                                  <button type="button" className="btn btn-primary" onClick={this.onDeclineBtnClick.bind(this, jobId, (constant['JOB_STEPS']['APPLIED'] * -1), item._id, index)}>
                                    decline
                                  </button>
                                  <button type="button" className="btn btn-primary" onClick={this.updateCandidateJobStatus.bind(this, jobId, constant['JOB_STEPS']['INTERVIEWING'], item._id, index)}>
                                    Interview
                                  </button>
                                </div>
                          }
                        </div>
                        <span className="clearfix"></span>
                      </div>
                    ))
                  }

                  <ModalPopup modalPopupObj={this.state.modalPopupObj} />
                </div>
              :
                <div>No attorneys have applied for this job.</div>
            }
          </div>
        }
      </div>
    );
  }
}
