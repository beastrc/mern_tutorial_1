import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import renderHTML from 'react-render-html';
let classNames = require('classnames');

import { Dashboard, JobStepsView } from '../../index';
import { constant, utils, helper, cookieManager } from '../../../shared/index';
import ModalPopup from '../../shared/modal-popup/ModalPopup';

export default class JobDetail extends React.Component {
  constructor(props) {
    super(props);
    let routesPath = constant['ROUTES_PATH'];
    this.state = {
      jobId: props.params.jobId,
      jobDetails: {},
      practiceAreas: [],
      skillsNeeded: [],
      isJobSaved: false,
      jobStatus: constant['JOB_STEPS']['APPLY'],
      posterJobStatus: constant['STATUS']['INACTIVE'],
      linkMapping: {
        'SEARCH_JOBS': { 'title': 'Job Search', 'link': routesPath['JOB_SEARCH'] },
        'APPLIED_JOBS': { 'title': 'My Jobs', 'link': routesPath['MY_APPLIED_JOBS'] },
        'POSTED_JOBS': { 'title': 'My Jobs', 'link': routesPath['MY_POSTED_JOBS'] },
      },
      fromRoute: (props.location.state !== null) ? props.location.state.fromRoute : (props.location.pathname.includes('my-posted-job') ? 'POSTED_JOBS' : 'SEARCH_JOBS'),
      isResponse: false,
      modalPopupObj: {},
      freezeActivity: false,
      isBarIdValid: 'Yes'
    };
    this.getJobDetails = this.getJobDetails.bind(this);
    this.updateJobStatus = this.updateJobStatus.bind(this);
    this.updatePostedJobStatus = this.updatePostedJobStatus.bind(this);
    this.saveJob = this.saveJob.bind(this);
    this.isFromPostedJob = this.isFromPostedJob.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getJobDetails();
    utils.setAllListsData(false);
  }

  isFromPostedJob(fromRoute) {
    return (fromRoute === 'POSTED_JOBS');
  }

  getFilterData(filterArr = [], filterId) {
    return filterArr.filter(function (filter) {
      return filter._id == filterId;
    });
  }

  getJobDetails() {
    let that = this;
    let userRole = constant['ROLE']['POSTER'];
    if (!this.isFromPostedJob(this.state.fromRoute)) {
      userRole = constant['ROLE']['SEEKER'];
    }
    utils.apiCall('GET_JOB_DETAIL', { 'params': [that.state.jobId, userRole] }, function (err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Job Detail');
        utils.logger('error', 'Get Job Detail Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let freezeActivity = utils.getDataFromRes(response, 'freeze_activity') || false;
          let isBarIdValid = utils.getDataFromRes(response, 'is_bar_id_valid') || 'Yes';
          let responseData = utils.getDataFromRes(response, 'job_detail');
          that.setState({
            freezeActivity: freezeActivity,
            isBarIdValid: isBarIdValid
          });
          that.setUserRelatedData(responseData);
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
      that.setState({
        isResponse: true
      });
    });
  }

  updatePostedJobStatus(jobId, action) {
    let that = this;
    let req = {};
    req.job_id = jobId;
    req.status = action
    utils.apiCall('UPDATE_POSTED_JOB_STATUS', { 'data': req }, function (err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while performing this action');
        utils.logger('error', 'Update Posted Job Status Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let resData = utils.getDataFromRes(response, 'status');
          let tempJobDetail = that.state.jobDetails;
          tempJobDetail['posted_at'] = resData['posted_at'];
          that.setState({
            posterJobStatus: resData['status'],
            jobDetails: tempJobDetail
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  updateJobStatus(jobId, action) {
    let that = this;
    let req = {};
    req.job_id = jobId;
    req.status = action;
    req.freeze_activity = that.state.freezeActivity;
    req.is_bar_id_valid = that.state.isBarIdValid;

    utils.apiCall('UPDATE_JOB_STATUS', { 'data': req }, function (err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while performing this action');
        utils.logger('error', 'Update Job Status Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          that.setState({
            jobStatus: utils.getDataFromRes(response, 'status')['status']
          });
        } else if (utils.isResConflict(response)) {
          helper.openConflictPopup(that);
        } else if (utils.isResBarIdValid(response)) {
          helper.openBarIdInvalidPopup(that);
        } else if (utils.isResLocked(response)) {
          helper.openFreezeActivityPopup(that, 'ACCOUNT_FROZEN_SEEKER');
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  saveJob(jobId, isSaveJob) {
    let that = this;
    let req = {
      job_id: jobId,
      key: isSaveJob ? 'save' : 'unsave'
    };
    utils.apiCall('UPDATE_SAVED_JOB', { 'data': req }, function (err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while performing this action');
        utils.logger('error', 'Update Saved Job Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          that.setState({
            isJobSaved: true
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  setJobData(jobData, listsObj) {
    let jobDetails = {};
    let practiceAreas = [];
    let skillsNeeded = [];

    let stateId = jobData.state;
    let settingId = jobData.setting_id;
    let jobPracticeAreas = jobData.practiceArea;
    let jobSkillsNeeded = jobData.skillsNeeded;

    let states = listsObj.states;
    let work_locations = listsObj.work_locations;

    if (jobData.is_saved) {
      if (jobData.is_saved.length > 0) {
        this.state.isJobSaved = true;
      }
    }

    this.state.jobStatus = jobData.job_step ? jobData.job_step : constant['JOB_STEPS']['APPLY'];
    this.state.posterJobStatus = jobData.status;

    if (jobPracticeAreas) {
      for (let i = 0; i < jobPracticeAreas.length; i++) {
        if (jobPracticeAreas[i].label) {
          practiceAreas.push(jobPracticeAreas[i].label);
        }
      }
    }

    if (jobSkillsNeeded) {
      for (let i = 0; i < jobSkillsNeeded.length; i++) {
        if (jobSkillsNeeded[i].label) {
          skillsNeeded.push(jobSkillsNeeded[i].label);
        }
      }
    }

    let stateDetails = this.getFilterData(states, stateId);
    let settingDetails = this.getFilterData(work_locations, settingId);

    if (stateDetails.length > 0) {
      jobDetails.stateName = stateDetails[0].name;
      jobDetails.stateAbbr = stateDetails[0].abbr;
    }

    if (settingDetails.length > 0) {
      jobDetails.settingName = settingDetails[0].name;
    }

    jobDetails.city = jobData.city;
    jobDetails.jobDescription = jobData.jobDescription;
    jobDetails.jobHeadline = jobData.jobHeadline;
    jobDetails.hours = jobData.hours;
    jobDetails.duration = jobData.duration;
    jobDetails.durationPeriod = jobData.durationPeriod;
    jobDetails.rate = jobData.rate;
    jobDetails.rateType = jobData.rateType;
    jobDetails.posted_at = jobData.posted_at;
    jobDetails.estimatedStartDate = jobData.estimatedStartDate;
    jobDetails.currentHighestJobStep = (jobData.current_highest_job_step && jobData.current_highest_job_step >= constant['JOB_STEPS']['APPLIED']) ? jobData.current_highest_job_step : constant['JOB_STEPS']['APPLIED'];
    jobDetails.stepData = jobData.step_data;
    jobDetails.declinedCandidates = jobData.declined_candidates || [];
    jobDetails.jobId = jobData._id;
    jobDetails.jobType = jobData.jobType;
    jobDetails.paymentType = jobData.paymentType;
    jobDetails.userId = jobData.userId;

    this.setState({
      jobDetails: jobDetails,
      practiceAreas: practiceAreas,
      skillsNeeded: skillsNeeded
    });
  }

  setUserRelatedData(jobData) {
    let that = this;
    utils.apiCall('GET_ALL_LISTS', {}, function (err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);
          that.setJobData(jobData, data);
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  render() {
    let jobDetails = this.state.jobDetails;
    let practiceAreas = this.state.practiceAreas;
    let skillsNeeded = this.state.skillsNeeded;
    let fromRoute = this.state.fromRoute;
    let headerText = this.state.linkMapping[fromRoute].title;
    let headerLink = this.state.linkMapping[fromRoute].link;
    let jobStatus = this.state.jobStatus;
    let freezeActivity = this.state.freezeActivity || false;

    let stepDataObj = (jobDetails.stepData && jobDetails.stepData.length) ? jobDetails.stepData[0] : null;
    let interviewingStep = constant['JOB_STEPS']['INTERVIEWING'];
    let nTermsStep = constant['JOB_STEPS']['N_TERMS'];

    if (stepDataObj && stepDataObj.status === constant['N_TERMS_STATUS']['NOT_SENT']) {
      if (jobStatus === nTermsStep) {
        jobStatus = interviewingStep;
      } else if (jobStatus === (nTermsStep * -1)) {
        jobStatus = (interviewingStep * -1);
      }
    }

    if (fromRoute === 'SEARCH_JOBS' && this.state.isBarIdValid.toLowerCase() === 'no') {
      freezeActivity = true;
    }
    let applyBtnClass = classNames({
      'btn mr-10 btn-primary': true,
      'seized-btn': freezeActivity
    });

    return (
      <Dashboard>
        <ToastContainer />
        <section className="job-details-wrapper">
          <div className="section-head">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
              <li className="breadcrumb-item active">Job {this.isFromPostedJob(fromRoute) ? 'Posting' : 'Searching'}</li>
              <p>
                <Link to={headerLink}> {headerText} </Link><i className="fa fa-angle-right mr-15 ml-15" aria-hidden="true"></i> Job Detail
                  </p>
            </ol>
            {
              (this.isFromPostedJob(fromRoute) && jobDetails.currentHighestJobStep < constant['JOB_STEPS']['IN_PROGRESS']) ?
                <div className="d-inline">
                  <button type="button" className="btn edit-profile-btn pull-right" onClick={() => utils.changeUrl(location.pathname + '/edit')}>
                    <a>
                      <i className="fa fa-pencil" aria-hidden="true"></i>Edit Job
                      </a>
                  </button>
                  <span className="clearfix"></span>
                </div>
                :
                null
            }
          </div>

          {this.isFromPostedJob(fromRoute) ?
            this.state.posterJobStatus === constant['STATUS']['ACTIVE'] ?
              <JobStepsView role='poster' jobType={jobDetails.jobType} paymentType={jobDetails.paymentType} step={jobDetails.currentHighestJobStep} stepRelatedData={jobDetails.stepData} declinedCandidateList={jobDetails.declinedCandidates} jobId={jobDetails.jobId} userId={jobDetails.userId} />
              :
              null
            :
            jobStatus !== constant['JOB_STEPS']['APPLY'] ?
              <JobStepsView role='seeker' jobType={jobDetails.jobType} paymentType={jobDetails.paymentType} step={jobStatus} stepRelatedData={jobDetails.stepData} jobId={jobDetails.jobId} freezeActivity={this.state.freezeActivity} userId={jobDetails.userId} />
              :
              null
          }

          {this.state.isResponse ?
            (
              <div className="job-details-card">
                <div className="card-content">
                  <div>
                    <a className="job-title col-xs-9 col-sm-10 pl-0 pr-0">
                      {jobDetails.jobHeadline}
                    </a>
                    <div className="hourly-estimate col-xs-3 col-sm-2 p-0">
                      ${jobDetails.rate}<div>{jobDetails.rateType ? (jobDetails.rateType).toLowerCase() : jobDetails.rateType} (Est.)</div>
                    </div>
                    <span className="clearfix"></span>
                  </div>
                  <div className="mt-0 mb-0 job-detail-list">
                    {practiceAreas.length > 0 ?
                      <p className="text-capitalize">
                        <i className="fa fa-bookmark" aria-hidden="true"></i>
                        {practiceAreas.join(", ")}
                      </p>
                      : ''
                    }
                    {jobDetails.settingName ?
                      <p className="text-capitalize">
                        <i className="fa fa-cog" aria-hidden="true"></i>{jobDetails.settingName}
                      </p>
                      : ''
                    }
                    <p className="text-capitalize">
                      <i className="fa fa-calendar" aria-hidden="true"></i>est. time: {jobDetails.hours} hrs., {jobDetails.duration} {jobDetails.durationPeriod}
                    </p>
                    {jobDetails.city ?
                      <p className="text-capitalize">
                        <i className="fa fa-map-pin" aria-hidden="true"></i> {jobDetails.city + ', ' + jobDetails.stateAbbr}
                      </p>
                      : ''
                    }
                    {skillsNeeded.length > 0 ?
                      <p className="text-capitalize">
                        <i className="fa fa-cube" aria-hidden="true"></i>
                        {skillsNeeded.join(", ")}
                      </p>
                      : ''
                    }
                    {jobDetails.jobDescription ?
                      <p className="para m-0 pt-0">
                        {renderHTML(jobDetails.jobDescription)}
                      </p>
                      : ''
                    }
                  </div>
                  <div className="card-content-footer row">
                    <div className="col-sm-6">
                      <div className="pb-5">Posted:<span>{(this.state.posterJobStatus && jobDetails.posted_at) ? utils.convertUtcToEst(jobDetails.posted_at).format(constant['JOB_DATE_FORMAT']) : constant['NO_DATA_SYMBOL']}</span></div>
                      <div>Desired Start Date:<span>{jobDetails.estimatedStartDate ? moment(jobDetails.estimatedStartDate).format(constant['JOB_DATE_FORMAT']) : 'ASAP'}</span></div>
                    </div>
                    <div className="col-sm-6 text-right">
                      {/* this.state.isJobSaved ?
                              <button type="button" className="btn btn-primary mr-10 btn-saved">
                                Saved
                              </button>
                            :
                              <button type="button" className="btn btn-primary mr-10" onClick={this.saveJob.bind(this,this.state.jobId,true)}>
                                Save
                              </button>
                            */}

                      {this.isFromPostedJob(fromRoute) ?
                        this.state.posterJobStatus === constant['STATUS']['INACTIVE'] ?
                          <button type="button" className="btn mr-10 btn-unposted" onClick={this.updatePostedJobStatus.bind(this, this.state.jobId, constant['STATUS']['ACTIVE'])}>
                            Un-Posted
                                </button>
                          : null
                        :
                        this.state.jobStatus === constant['JOB_STEPS']['APPLY'] ?
                          <button type="button" className={applyBtnClass} onClick={this.updateJobStatus.bind(this, this.state.jobId, constant['JOB_STEPS']['APPLIED'])}>
                            Apply Now
                                </button>
                          : null
                      }
                    </div>
                  </div>
                </div>{/*card-content*/}
              </div>
            )
            :
            null
          }
        </section>
        <span className="clearfix"></span>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </Dashboard>
    );
  }
}
