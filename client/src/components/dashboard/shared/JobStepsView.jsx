import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

import { constant, utils } from '../../../shared/index';
import {
  Applied,
  Interviewing,
  NegotiatingTerms,
  StartPending,
  InProgress,
  JobComplete
} from './steps/index';

export default class JobStepsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: props.step || constant['JOB_STEPS']['APPLIED'],
      highestStep: props.step || constant['JOB_STEPS']['APPLIED'],
      stepRelatedData: props.stepRelatedData || [],
      declinedCandidateList: props.declinedCandidateList || [],
      jobType: props.jobType || '',
      paymentType: props.paymentType || '',
      userId: props.userId || ''
    };
    this.handler = this.handler.bind(this);
    this.getStepData = this.getStepData.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      step: props.step,
      highestStep: props.step,
      stepRelatedData: props.stepRelatedData,
      declinedCandidateList: props.declinedCandidateList,
      jobType: props.jobType,
      paymentType: props.paymentType,
      userId: props.userId
    });
  }

  handler(action, newHighestStep) {
    if (action < 0) {
      if (this.props.role === constant['ROLE']['SEEKER']) {
        this.setState({
          step: action,
          highestStep: action
        });
      } else {
        if (newHighestStep < this.state.highestStep) {
          let hStep = newHighestStep;
          if (newHighestStep < 0) {
            hStep = constant['JOB_STEPS']['APPLIED'];
          }

          if (action !== constant['JOB_STEPS']['APPLIED'] * -1) {
            setTimeout(() => {
              this.getStepData(this.props.jobId, hStep, this.props.role, true);
            }, 0);
          } else {
            this.setState({
              step: hStep,
              highestStep: hStep
            });
          }
        }
      }
    } else {
      if (newHighestStep > this.state.highestStep) {
        if (
          this.state.jobType == '1099' &&
          this.state.paymentType == 'Hourly Rate/Fixed Fee' &&
          newHighestStep == constant['JOB_STEPS']['IN_PROGRESS']
        ) {
          this.setState({
            highestStep: newHighestStep,
            step: newHighestStep
          });
          this.getStepData(
            this.props.jobId,
            newHighestStep,
            this.props.role,
            true
          );
        } else {
          this.setState({
            highestStep: newHighestStep
          });
        }
      }
    }
  }

  getStepData(jobId, step, userRole, isCallFromHandler) {
    let that = this;
    const { highestStep } = this.state;
    const req = {
      job_id: jobId,
      step,
      highestStep,
      user_role: userRole
    };

    utils.apiCall('GET_STEP_DATA', { data: req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Step Data');
        utils.logger('error', 'Get Step Data Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          const stepRelatedData = utils.getDataFromRes(response, 'step_data');

          that.setState(
            {
              step,
              highestStep: isCallFromHandler === true ? step : highestStep,
              stepRelatedData,
              declinedCandidateList:
                utils.getDataFromRes(response, 'declined_candidates') || []
            },
            function() {
              isCallFromHandler === true && window.scroll(0, 0);
            }
          );
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  gotoJobCompleteStep(step) {
    utils.loader('start');
    setTimeout(() => {
      this.setState(
        {
          step: step,
          highestStep: step,
          stepRelatedData: [],
          declinedCandidateList: []
        },
        function() {
          window.scroll(0, 0);
          utils.loader('stop');
        }
      );
    }, 500);
  }

  render() {
    let absStepVal = Math.abs(this.state.step);
    const { role, jobId, userId, freezeActivity } = this.props;
    const {
      step,
      highestStep,
      stepRelatedData,
      declinedCandidateList,
      jobType,
      paymentType
    } = this.state;

    return (
      <div>
        <div className="bg-white widget-wrapper clearfix">
          <section className="steps-widget">
            <div className="navigation-controller mt-50">
              <button
                className="btn btn-primary mr-10 width-200 navigation-button"
                disabled={absStepVal === constant['JOB_STEPS']['APPLIED']}
                onClick={() =>
                  this.getStepData(jobId, absStepVal - 1, role, false)
                }
              >
                <i className="fa fa-chevron-left mr-5" />
                Previous
                <div className="lower-label">
                  {constant['STEP_WORDS'][absStepVal - 1]}
                </div>
              </button>
              <Dropdown id="step-dropdown">
                <Dropdown.Toggle className="width-200">
                  {constant['STEP_WORDS'][absStepVal]}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Object.keys(constant['STEP_WORDS']).map(step => (
                    <MenuItem
                      key={step}
                      eventKey={step}
                      disabled={step > highestStep}
                      onSelect={() =>
                        this.getStepData(jobId, Number(step), role, false)
                      }
                    >
                      <span>{constant['STEP_WORDS'][step]}</span>
                    </MenuItem>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <button
                className="btn btn-primary width-200 navigation-button"
                disabled={absStepVal >= highestStep}
                onClick={() => {
                  this.getStepData(jobId, absStepVal + 1, role, false);
                }}
              >
                Next
                <i className="fa fa-chevron-right ml-5" />
                <div className="lower-label">
                  {constant['STEP_WORDS'][absStepVal + 1]}
                </div>
              </button>
            </div>
          </section>
          <div>
            {
              {
                101: (
                  <Applied
                    role={role}
                    stepRelatedData={stepRelatedData}
                    declinedCandidateList={declinedCandidateList}
                    jobId={jobId}
                    step={step}
                    highestStep={highestStep}
                    handler={this.handler}
                  />
                ),
                102: (
                  <Interviewing
                    role={role}
                    stepRelatedData={stepRelatedData}
                    jobId={jobId}
                    step={step}
                    highestStep={highestStep}
                    handler={this.handler}
                    freezeActivity={freezeActivity}
                  />
                ),
                103: (
                  <NegotiatingTerms
                    jobType={jobType}
                    paymentType={paymentType}
                    role={role}
                    stepRelatedData={stepRelatedData[0] || {}}
                    jobId={jobId}
                    step={step}
                    highestStep={highestStep}
                    handler={this.handler}
                  />
                ),
                104: (
                  <StartPending
                    jobType={jobType}
                    paymentType={paymentType}
                    role={role}
                    stepRelatedData={stepRelatedData[0] || {}}
                    jobId={jobId}
                    step={step}
                    highestStep={highestStep}
                    handler={this.handler}
                    freezeActivity={freezeActivity}
                    userId={userId}
                  />
                ),
                105: (
                  <InProgress
                    jobType={jobType}
                    paymentType={paymentType}
                    role={role}
                    stepRelatedData={stepRelatedData}
                    jobId={jobId}
                    step={step}
                    highestStep={highestStep}
                    handler={this.handler}
                  />
                ),
                106: (
                  <JobComplete
                    role={role}
                    stepRelatedData={stepRelatedData}
                    jobId={jobId}
                  />
                )
              }[absStepVal]
            }
          </div>
        </div>
      </div>
    );
  }
}
