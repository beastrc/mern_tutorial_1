import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
// import { Truncate } from 'react-read-more';
import ReadMoreReact from 'read-more-react';
import { ToastContainer, toast } from 'react-toastify';
let classNames = require('classnames');

import { constant, helper, utils, cookieManager } from '../../../shared/index';

export default class Job extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isJobSaved: false,
      jobStatus: constant['JOB_STEPS']['APPLY'],
      posterJobStatus: props.job.status,
      postedAt: props.job.posted_at,
      posterTotalApplied: props.job.total_applied,
      modalPopupObj: props.job.modalPopupObj || {},
      freezeActivity: props.freezeActivity || false,
      isBarIdValid: props.isBarIdValid || 'Yes'
    };
    this.updateJobStatus = this.updateJobStatus.bind(this);
    this.updatePostedJobStatus = this.updatePostedJobStatus.bind(this);
    this.saveJob = this.saveJob.bind(this);
  }

  getFilterData(filterArr = [], filterId) {
    return filterArr.filter(function(filter) {
      return filter._id == filterId;
    });
  }

  updatePostedJobStatus(jobId, action) {
    let that = this;
    let req = {};
    req.job_id = jobId;
    req.status = action
    utils.apiCall('UPDATE_POSTED_JOB_STATUS', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while performing this action');
        utils.logger('error', 'Update Posted Job Status Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let resData = utils.getDataFromRes(response, 'status');
          that.setState({
            posterJobStatus: resData['status'],
            postedAt: resData['posted_at']
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  updateJobStatus(jobId, action) {
    let that = this;
    let req = {
      job_id: jobId,
      status: action,
      freeze_activity: that.state.freezeActivity,
      is_bar_id_valid: that.state.isBarIdValid
    };
    utils.apiCall('UPDATE_JOB_STATUS', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while performing this action');
        utils.logger('error', 'Update Job Status Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          that.setState({
            jobStatus: utils.getDataFromRes(response, 'status')['status']
          });
        } else if (utils.isResConflict(response)) {
          helper.openConflictPopup(that.state.modalPopupObj);
        } else if (utils.isResBarIdValid(response)) {
          helper.openBarIdInvalidPopup(that.state.modalPopupObj);
        } else if (utils.isResLocked(response)) {
          helper.openFreezeActivityPopup(that.state.modalPopupObj, 'ACCOUNT_FROZEN_SEEKER');
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  saveJob(jobId, isSaveJob) {
    let that = this;
    let req = {};
    req.key = isSaveJob ? 'save' : 'unsave';
    req.job_id = jobId;
    utils.apiCall('UPDATE_SAVED_JOB', { 'data': req }, function(err, response) {
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

  getPosterHighestStep() {
    let hStep = 0;
    if (this.state.posterTotalApplied && this.state.posterTotalApplied.length) {
      hStep = Math.max(...this.state.posterTotalApplied);
    }
    return hStep;
  }

  render() {
    let job = this.props.job;
    let userRelatedData = this.props.userRelatedData;
    let jobPracticeAreas = job.practiceArea;
    let work_locations = userRelatedData.work_locations;
    let settingId = job.setting_id;
    let practiceAreas = [];
    let settingName = '';
    let totalApplied = 0;
    let posterHighestStep = this.getPosterHighestStep();

    if(jobPracticeAreas) {
      let practiceAreaLength = jobPracticeAreas.length;
      for(let i=0;i<practiceAreaLength;i++) {
        practiceAreas.push(jobPracticeAreas[i].label);
      }
    }
    if(job.is_saved) {
      if(job.is_saved.length > 0) {
        this.state.isJobSaved = true;
      }
    }

    if(job.total_applied && job.total_applied.length > 0) {
      totalApplied = job.total_applied.length;
    }

    let settingDetails = this.getFilterData(work_locations,settingId);

    if(settingDetails.length>0) {
      settingName = settingDetails[0].name;
    }

    if (job.fromRoute === 'POSTED_JOBS') {
      var postedJobStatusText = 'Un-Posted';
      if (this.state.posterJobStatus === constant['STATUS']['ACTIVE']) {
        postedJobStatusText = 'Posted'
      }

      // if (this.state.posterTotalApplied.length) {
        switch(posterHighestStep) {
          case constant['JOB_STEPS']['INTERVIEWING']: postedJobStatusText = 'Interviewing';
          break;
          case constant['JOB_STEPS']['N_TERMS']: postedJobStatusText = 'Negotiating Terms';
          break;
          case constant['JOB_STEPS']['S_PENDING']: postedJobStatusText = 'Start Pending';
          break;
          case constant['JOB_STEPS']['IN_PROGRESS']: postedJobStatusText = 'In Progress';
          break;
          case constant['JOB_STEPS']['J_COMPLETE']: postedJobStatusText = 'Complete';
          break;
        }
      // }
    } else {
      if (job.step && job.step !== constant['JOB_STEPS']['APPLY']) {
        this.state.jobStatus = job.step;
      }

      var appliedJobStatusText = 'Apply Now';
      if (this.state.jobStatus < 0) {
        appliedJobStatusText = 'Declined';
        if (job.declinedBy === constant['ROLE']['POSTER']) {
          appliedJobStatusText = 'Hiring Manager ' + appliedJobStatusText;
        }
      } else {
        switch(this.state.jobStatus) {
          case constant['JOB_STEPS']['APPLIED']: appliedJobStatusText = 'Applied';
          break;
          case constant['JOB_STEPS']['INTERVIEWING']: appliedJobStatusText = 'Interviewing';
          break;
          case constant['JOB_STEPS']['N_TERMS']: appliedJobStatusText = (job.nTermStatus === constant['N_TERMS_STATUS']['SENT']) ? 'Negotiating Terms' : 'Interviewing';
          break;
          case constant['JOB_STEPS']['S_PENDING']: appliedJobStatusText = 'Start Pending';
          break;
          case constant['JOB_STEPS']['IN_PROGRESS']: appliedJobStatusText = 'In Progress';
          break;
          case constant['JOB_STEPS']['J_COMPLETE']: appliedJobStatusText = 'Complete';
          break;
        }
      }
    }

    let freeze_activity = false;
    if (this.state.jobStatus > 0 && job.fromRoute !== 'POSTED_JOBS') {
      freeze_activity = this.state.freezeActivity;
    }

    if (job.fromRoute === 'SEARCH_JOBS' && this.state.isBarIdValid.toLowerCase() === 'no' ) {
      freeze_activity = true;
    }

    var jobBtnClass = classNames({
      'btn ml-10': true,
      'btn-primary': (this.state.jobStatus === constant['JOB_STEPS']['APPLY'] && job.fromRoute !== 'POSTED_JOBS'),
      'btn-applied': ((this.state.jobStatus > constant['JOB_STEPS']['APPLY'] && this.state.jobStatus < constant['JOB_STEPS']['S_PENDING']) || (job.fromRoute === 'POSTED_JOBS' && this.state.posterJobStatus === constant['STATUS']['ACTIVE'] && posterHighestStep < constant['JOB_STEPS']['S_PENDING'])),
      'btn-grey-disabled': (this.state.jobStatus < 0 && job.fromRoute !== 'POSTED_JOBS'),
      'btn-unposted': (job.fromRoute === 'POSTED_JOBS' && this.state.posterJobStatus === constant['STATUS']['INACTIVE']),
      'btn-saved': (this.state.jobStatus > constant['JOB_STEPS']['N_TERMS'] && this.state.jobStatus < constant['JOB_STEPS']['J_COMPLETE']) || (posterHighestStep > constant['JOB_STEPS']['N_TERMS'] && posterHighestStep < constant['JOB_STEPS']['J_COMPLETE']),
      'btn-done': ((this.state.jobStatus === constant['JOB_STEPS']['J_COMPLETE']) || (posterHighestStep === constant['JOB_STEPS']['J_COMPLETE'])),
      'seized-btn': freeze_activity
    });

    var jobDetailLinkToObj = {
      pathname: location.pathname + '/' + job._id,
      state: {
        fromRoute: job.fromRoute
      }
    }

    return (
      <div className="card-content">
        <ToastContainer />
        <div>
          <Link to={jobDetailLinkToObj} className="job-title col-xs-9 col-sm-10" >
            {job.jobHeadline}
          </Link>

          <div className="hourly-estimate col-xs-3 col-sm-2 p-0">
            ${job.rate}<div>{job.rateType ? (job.rateType).toLowerCase() : job.rateType} (Est.)</div>
          </div>
          <span className="clearfix"></span>
        </div>

        <div className="row sub-titles">
          { practiceAreas.length > 0 ?
            <div className="col-sm-4">
              <span className="d-inline-block truncate-80">
                <i className="fa fa-bookmark" aria-hidden="true"></i>
              {practiceAreas.slice(0, 2).join(", ")}</span>
              {practiceAreas.length > 2 ? <span className="d-inline-block v-bottom"> +{practiceAreas.length - 2}</span> : '' }
            </div>
            : ''
          }
          { settingName.length > 0 ?
            <div className="col-sm-4">
              <span className="d-inline-block truncate-80">
                <i className="fa fa-cog" aria-hidden="true"></i>
                {settingName}
              </span>
            </div>
            : ''
          }
          <div className="col-sm-4">
            <span className="d-inline-block truncate-80">
              <i className="fa fa-calendar" aria-hidden="true"></i>
              Est. Time: {job.hours} hrs., {job.duration} {job.durationPeriod}
            </span>
          </div>
        </div>
        <p className="m-0">
          <ReadMoreReact 
            text={job.jobDescription}
            min={80}
            ideal={300}
            max={500}
            readMoreText="read more"/>

          {/*<Truncate lines={3} ellipsis={<span>... <Link className="more" to={jobDetailLinkToObj}>more</Link></span>}>
            {job.jobDescription}
          </Truncate>*/}
        </p>
        <div className="card-content-footer row">
          <div className="col-sm-4">
            <div className="pb-5">Posted:<span>{(this.state.posterJobStatus && this.state.postedAt) ? utils.convertUtcToEst(this.state.postedAt).format(constant['JOB_DATE_FORMAT']) : constant['NO_DATA_SYMBOL']}</span></div>
            <div>Desired Start Date:<span>{job.estimatedStartDate ? moment(job.estimatedStartDate).format(constant['JOB_DATE_FORMAT']) : 'ASAP'}</span></div>
          </div>
          <div className="col-sm-8 text-right">
          {/*
            { this.state.isJobSaved ?
              <button type="button" className="btn btn-primary mr-10 btn-saved">Saved</button>
              :
              <button type="button" className="btn btn-primary mr-10" onClick={this.saveJob.bind(this, job._id, true)}>Save</button>
            }
            */}
            { totalApplied > 0 ?

              <span className="mr-10">
                <img className="mr-10" src={constant['IMG_PATH'] + 'svg-images/user-icon.svg'} alt="user-icon-fill"/>
                {totalApplied} Applied
              </span>
              : ''
            }
            {
              <Link to={jobDetailLinkToObj}>
                <button type="button" className="btn btn-primary mr-10">
                  View Job
                </button>
              </Link>
            }
            { job.fromRoute === 'POSTED_JOBS' ?
              <button type="button" className={jobBtnClass} disabled={this.state.posterJobStatus === constant['STATUS']['ACTIVE']} onClick={this.updatePostedJobStatus.bind(this, job._id, constant['STATUS']['ACTIVE'])}>
                {postedJobStatusText}
              </button>
              :
              <button type="button" className={jobBtnClass} disabled={this.state.jobStatus !== constant['JOB_STEPS']['APPLY']} onClick={this.updateJobStatus.bind(this, job._id, constant['JOB_STEPS']['APPLIED'])}>
                {appliedJobStatusText}
              </button>
            }
          </div>
        </div>
      </div>
    );
  }
}
