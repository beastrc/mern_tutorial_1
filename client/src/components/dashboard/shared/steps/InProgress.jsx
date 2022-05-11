import React from 'react';
import moment from 'moment';
import Pagination from 'react-js-pagination';

import { constant, helper, utils } from '../../../../shared/index';
import ModalPopup from '../../../shared/modal-popup/ModalPopup';
import { PresignedPost } from 'aws-sdk/clients/s3';
let classNames = require('classnames');

const TAB_TYPE = {
  'PENDING': 'pending',
  'PAST': 'past',
  'COMPLETED': 'completed'
}

const SORT = {
  'BY': {
    'DUE_DATE': 'dueDate',
    'STATUS': 'status',
    'MILESTONE': 'milestone'
  },
  'ORDER': {
    'ASC': 1,
    'DESC': -1
  }
}

export default class InProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stepRelatedData: props.stepRelatedData['data'] || [],
      deliverableType: TAB_TYPE['PENDING'],
      sortBy: SORT['BY']['DUE_DATE'],
      sortOrder: SORT['ORDER']['ASC'],
      modalPopupObj: {},
      totalDeliverables: props.stepRelatedData['count'],
      activePage: 1,
      itemsCountPerPage: 10,
      actionMilestoneId: props.stepRelatedData['action_milestone_id'],
      jobType: props.jobType,
      paymentType: props.paymentType
    }

    this.onSubmitBtnClick = this.onSubmitBtnClick.bind(this);
    this.onSendMsgBtnClick = this.onSendMsgBtnClick.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onSortIconClick = this.onSortIconClick.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.payNow = this.payNow.bind(this);

    $(document).on('slide.bs.carousel', '#deliverables_carousel', (e) => {
      this.onTabChange(e, $(e.relatedTarget).attr('data-tab-type'));
    });
  }

  componentDidMount() {
    if (this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') {
      this.onTabChange(null, this.state.deliverableType);    
    }
  }

  setStateObj(obj) {
    if (this.refs.inProgressRef) {
      this.setState(obj);
    }
  }

  onSubmitBtnClick(role, data) {
    helper.openSubmitDeliverablePopup(this, role, data, (prevStepRelatedData, paymentDetailObj, status, isJobCompleted, url) => {
      let stepRelatedData = this.state.stepRelatedData;
      stepRelatedData.find((o, i) => {
        if (o['paymentDetails']['milestone'] === paymentDetailObj['milestone']) {
          if (status === constant['DELIVERABLE_STATUS']['APPROVED']) {
            stepRelatedData.splice(i, 1);
            let activePage = this.state.activePage;
            if (this.state.totalDeliverables > this.state.itemsCountPerPage && (activePage === 1 || !stepRelatedData.length)) {
              this.handlePageChange(activePage > 1 ? --activePage : activePage);
            } else if (isJobCompleted) {
              let job_complete_step = constant['JOB_STEPS']['J_COMPLETE'];
              this.props.handler(job_complete_step, job_complete_step);
            }
            if (!!url) {
              setTimeout(() => {
                if (this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') {
                  helper.openTransferFundsPopup(this, prevStepRelatedData[0]);
                } else {
                  helper.openReleasePaymentPopup(this, paymentDetailObj);
                }
              }, 600);
            }
          } else {
            stepRelatedData[i]['paymentDetails']['status'] = status;
          }
          return true;
        }
      });

      this.setStateObj({
        stepRelatedData: stepRelatedData
      });
    });
  }

  onSendMsgBtnClick(userId) {
    helper.openSendMessagePopup(this, userId);
  }

  isSeeker() {
    return (this.props.role === constant['ROLE']['SEEKER']);
  }

  isCompletedDeliverablesTab(type) {
    return (type === TAB_TYPE['COMPLETED']);
  }

  getDeliverables(type) {
    let stepRelatedData = this.state.stepRelatedData,
    noDataSymbol = constant['NO_DATA_SYMBOL'];
    if (stepRelatedData.length > this.state.itemsCountPerPage) {
      stepRelatedData.splice(this.state.itemsCountPerPage, stepRelatedData.length);
    }

    return (
      stepRelatedData.length ?
        <div>
          <div className="custom-table mb-30 mt-15">
            {
              this.getDeliverablesHeader(type)
            }
            <div className="custom-tbody">
              {
                stepRelatedData.map((item, index) => (
                  <div key={index} className="custom-tr">
                    <div className="custom-td">
                      <span>{item.paymentDetails.milestone}</span>
                    </div>
                    <div className="custom-td">
                      {(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') ?
                      <span className="delivery-break-word" title="On Completion">On Completion</span>
                      :
                      <span className="delivery-break-word" title={item.paymentDetails.delivery}>{item.paymentDetails.delivery || noDataSymbol}</span>
                      }
                    </div>
                    <div className="custom-td">
                      {(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') ?
                      <span>N/A</span>
                      :
                      <span>{item.paymentDetails.dueDate ? moment(item.paymentDetails.dueDate).format(constant['JOB_DATE_FORMAT']) : noDataSymbol}</span>
                      }
                    </div>
                    <div className="custom-td">
                      {(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') ?
                        <span title={item.rate}>${item.rate}{item.rateType == utils.ENUM.RATE_TYPE.HOURLY && '/Hour'}</span>
                        :
                        <span title={item.paymentDetails.rate}>${item.paymentDetails.rate}</span>
                      }
                    </div>
                    <div className="custom-td">
                      {
                        this.getDeliverablesStatus(type, item.paymentDetails)
                      }
                    </div>
                    {
                      this.isCompletedDeliverablesTab(type) ?
                        null
                      :
                        this.getDeliverablesAction(item)
                    }
                  </div>
                ))
              }
            </div>
          </div>
          {
            this.getPagination()
          }
        </div>
      :
        <div className="no-content-found mb-30 mt-15">
          No deliverables available
        </div>
    )
  }

  getResponsiveDeliverables(type) {
    let stepRelatedData = this.state.stepRelatedData,
    noDataSymbol = constant['NO_DATA_SYMBOL'];
    return (
      stepRelatedData.length ?
        <div>
          <h5 className="pull-right sorting">
            <div className="dropdown">
              <div className="dropdown-toggle" data-toggle="dropdown">
                Sorting <i className="fa fa-sort"></i>
              </div>
              <ul className="dropdown-menu">
                <li><a href="javascript:void(0)" className={this.isActive('DUE_DATE', 'ASC') ? 'active' : ''} onClick={(e) => this.onSortIconClick(e, SORT['BY']['DUE_DATE'], SORT['ORDER']['ASC'])}>Due Date (Ascending)</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="javascript:void(0)" className={this.isActive('DUE_DATE', 'DESC') ? 'active' : ''} onClick={(e) => this.onSortIconClick(e, SORT['BY']['DUE_DATE'], SORT['ORDER']['DESC'])}>Due Date (Descending)</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="javascript:void(0)" className={this.isActive('MILESTONE', 'ASC') ? 'active' : ''} onClick={(e) => this.onSortIconClick(e, SORT['BY']['MILESTONE'], SORT['ORDER']['ASC'])}>Milestone (Ascending)</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="javascript:void(0)" className={this.isActive('MILESTONE', 'DESC') ? 'active' : ''} onClick={(e) => this.onSortIconClick(e, SORT['BY']['MILESTONE'], SORT['ORDER']['DESC'])}>Milestone (Descending)</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="javascript:void(0)" className={this.isActive('STATUS', 'ASC') ? 'active' : ''} onClick={(e) => this.onSortIconClick(e, SORT['BY']['STATUS'], SORT['ORDER']['ASC'])}>Status (A-Z)</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="javascript:void(0)" className={this.isActive('STATUS', 'DESC') ? 'active' : ''} onClick={(e) => this.onSortIconClick(e, SORT['BY']['STATUS'], SORT['ORDER']['DESC'])}>Status (Z-A)</a></li>
              </ul>
            </div>
          </h5>
          <span className="clearfix"></span>
          {
            stepRelatedData.map((item, index) => (
              <div key={index} className="card-view p-0 mb-20">
                <div className="job-title" data-toggle="collapse" data-target={'#milestone_' + item.paymentDetails.milestone} aria-expanded="false">
                  Milestone {item.paymentDetails.milestone}
                </div>
                <div className="job-details collapse p-15" id={'milestone_' + item.paymentDetails.milestone}>
                  <h6>Deliverable</h6>
                  <p>{item.paymentDetails.delivery || noDataSymbol}</p>
                  <h6>Due Date</h6>
                  <p>{item.paymentDetails.dueDate ? moment(item.paymentDetails.dueDate).format(constant['JOB_DATE_FORMAT']) : noDataSymbol}</p>
                  <h6>Price</h6>
                  <p>${item.paymentDetails.rate}</p>
                  <h6>Status</h6>
                  {
                    this.getDeliverablesStatus(type, item.paymentDetails)
                  }
                  {
                    this.isCompletedDeliverablesTab(type) ?
                      null
                    :
                      this.getDeliverablesAction(item)
                  }
                </div>
              </div>
            ))
          }
          {
            this.getPagination()
          }
        </div>
      :
        <h6 className = "no-deliverables">
          No deliverables available
        </h6>
    )
  }

  isActive(sortByKey, sortOrderKey) {
    return (this.state.sortBy === SORT['BY'][sortByKey] && this.state.sortOrder === SORT['ORDER'][sortOrderKey]);
  }

  getSortClass(sortBy) {
    let className = 'fa fa-sort';
    if (sortBy === this.state.sortBy) {
      className = className + (this.state.sortOrder === SORT['ORDER']['ASC'] ? ' fa-sort-up' : ' fa-sort-down');
    }
    return className;
  }

  getDeliverablesHeader(type) {
    let isCompletedDeliverablesTab = this.isCompletedDeliverablesTab(type);

    return (
      <div className="custom-thead">
        <div className="custom-tr">
          <div className="custom-th">
            <span className="cursor-pointer relative" onClick={(e) => this.onSortIconClick(e, SORT['BY']['MILESTONE'])}>Milestone <i className={this.getSortClass(SORT['BY']['MILESTONE'])}></i></span>
          </div>
          <div className="custom-th">Deliverable</div>
          <div className="custom-th">
            <span className="cursor-pointer relative" onClick={(e) => this.onSortIconClick(e, SORT['BY']['DUE_DATE'])}>Due Date <i className={this.getSortClass(SORT['BY']['DUE_DATE'])}></i></span>
          </div>
          <div className="custom-th">Price</div>
          <div className="custom-th">
            { isCompletedDeliverablesTab ?
                'Status'
              :
                <span className="cursor-pointer relative" onClick={(e) => this.onSortIconClick(e, SORT['BY']['STATUS'])}>Status <i className={this.getSortClass(SORT['BY']['STATUS'])}></i></span>
            }
          </div>
          { isCompletedDeliverablesTab ?
              null
            :
              <div className="custom-th">Action</div>
          }
        </div>
      </div>
    )
  }

  getDeliverablesStatus(type, paymentDetailObj) {
    let isCompletedDeliverablesTab = this.isCompletedDeliverablesTab(type);
    let status = paymentDetailObj['status'];
    let statusText = 'Pending';
    let className = '';

    switch(status) {
      case constant['DELIVERABLE_STATUS']['SUBMITTED']: statusText = 'Submitted';
      break;
      case constant['DELIVERABLE_STATUS']['APPROVED']: statusText = 'Approved';
      break;
      case constant['DELIVERABLE_STATUS']['RELEASED']: statusText = 'Payment Released';
      break;
      case constant['DELIVERABLE_STATUS']['PAID']: statusText = 'Paid';
      break;
      case constant['DELIVERABLE_STATUS']['DECLINED']:
        statusText = 'Declined';
        className = 'declined';
      break;
      case constant['DELIVERABLE_STATUS']['PENDING']:
        if (type === TAB_TYPE['PAST']) {
          statusText = 'Past Due';
          className = 'declined';
        }
      break;
    }
    return (<p className={className}>{ statusText } {(status === constant['DELIVERABLE_STATUS']['APPROVED'] && !this.isSeeker()) ? <span className="pay-now-link" onClick={() => this.payNow(paymentDetailObj)}>Pay Now</span> : null}</p>);
  }

  getDeliverablesAction(data) {
    let status = data['paymentDetails']['status'];
    data['jobId'] = this.props.jobId;
    data['jobType'] = this.state.jobType;
    data['paymentType'] = this.state.paymentType;
    let id = data['seekerId'],
    disableBtn = (status < constant['DELIVERABLE_STATUS']['SUBMITTED']),
    imgTitle = (disableBtn ? '' : 'Review'),
    imgAlt = 'Review',
    imgSrc = '/images/review-icon.png',
    role = constant['ROLE']['POSTER'];

    if (this.isSeeker()) {
      id = null;
      disableBtn = (status === constant['DELIVERABLE_STATUS']['SUBMITTED']);
      imgTitle = (disableBtn ? '' : (status === constant['DELIVERABLE_STATUS']['DECLINED'] ? 'Resubmit' : 'Submit'));
      imgAlt = 'Submit';
      imgSrc = '/images/icon-submit.png';
      role = constant['ROLE']['SEEKER'];
    }
    let imgButtonClass = classNames({
      'img-responsive': true,
      'd-inline': true,
      'disabled-btn': disableBtn
    })

    return (
      <div className="custom-td">
        {
          this.state.actionMilestoneId === data['paymentDetails']['_id'] ?
            <input type="image" disabled={disableBtn} className={imgButtonClass} data-toggle="tooltip" data-placement="bottom" title={imgTitle} alt={imgAlt} src={imgSrc} width="40" height="40" onClick={this.onSubmitBtnClick.bind(this, role, data)} />
          :
            null
        }
        <input type="image" className="img-responsive d-inline" data-toggle="tooltip" data-placement="bottom" title="Send Message" src="/images/message-icon.png" alt="message-icon" width="40" height="40" onClick={this.onSendMsgBtnClick.bind(this, id)} />
      </div>
    )
  }

  getPagination() {
    return (
      this.state.totalDeliverables > 0 ?
        <div>
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={this.state.itemsCountPerPage}
            totalItemsCount={this.state.totalDeliverables}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange}
          />
          <span className="clearfix"></span>
        </div>
      :
        null
    )
  }

  handlePageChange(pageNumber) {
    let filterObj = {
      deliverableType: this.state.deliverableType,
      sortBy: this.state.sortBy,
      sortOrder: this.state.sortOrder,
      pageNo: pageNumber || this.state.activePage,
      limit: this.state.itemsCountPerPage
    }
    this.getStepData(filterObj);
    window.scroll(0, 0);
  }

  onTabChange(evt, type) {
    let filterObj = {
      deliverableType: type,
      sortBy: SORT['BY']['DUE_DATE'],
      sortOrder: SORT['ORDER']['ASC'],
      pageNo: 1,
      limit: this.state.itemsCountPerPage
    }
    if (this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') {
      this.getStepData(filterObj);
    } else {
      if (type !== this.state.deliverableType) {
        this.getStepData(filterObj);
      }
    }
  }

  onSortIconClick(evt, sortBy, sOrder = 0) {
    let sortOrder = sOrder || SORT['ORDER']['ASC'];
    if (sOrder === 0 && sortBy === this.state.sortBy) {
      sortOrder = this.state.sortOrder * -1;
    } else if (sOrder !== 0 && sortBy === this.state.sortBy && sortOrder === this.state.sortOrder) {
      return;
    }

    let filterObj = {
      deliverableType: this.state.deliverableType,
      sortBy: sortBy,
      sortOrder: sortOrder,
      pageNo: 1,
      limit: this.state.itemsCountPerPage
    }

    this.getStepData(filterObj);
  }

  getStepData(filterObj) {
    let that = this;
    let req = {
      job_id: that.props.jobId,
      step: constant['JOB_STEPS']['IN_PROGRESS'],
      user_role: that.props.role,
      filterObj: filterObj,
    }

    utils.apiCall('GET_STEP_DATA', { 'data': req }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Step Data');
        utils.logger('error', 'Get Step Data Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let stepRelatedData = utils.getDataFromRes(response, 'step_data');
          let reqFilterObj = req['filterObj'];
          that.setStateObj({
            stepRelatedData: stepRelatedData['data'],
            totalDeliverables: stepRelatedData['count'],
            actionMilestoneId: stepRelatedData['action_milestone_id'],
            deliverableType: reqFilterObj['deliverableType'],
            sortBy: reqFilterObj['sortBy'],
            sortOrder: reqFilterObj['sortOrder'],
            activePage: reqFilterObj['pageNo']
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  payNow(paymentDetailObj) {
    let that = this;
    let reqObj = {
      'job_id': that.props.jobId,
      'milestone': paymentDetailObj.milestone,
      'milestone_id': paymentDetailObj._id
    }
    utils.apiCall('GET_RELEASE_FUND_URL', { 'data': reqObj }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting release fund url');
        utils.logger('error', 'Get Release Fund Url Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          if (that.state.jobType == '1099' && that.state.paymentType == 'Hourly Rate/Fixed Fee') {
            let stepData = that.state.stepRelatedData[0];
            stepData.jobId = that.props.jobId;
            stepData.jobType = that.props.jobType;
            stepData.paymentType = that.props.paymentType;
            helper.openTransferFundsPopup(that, stepData);
          } else {
            helper.openReleasePaymentPopup(that, paymentDetailObj);
          }
        } else if (utils.isResConflict(response)) {
          let cb = utils.getDataFromRes(response, 'job_completed') ? null : that.handlePageChange;
          helper.openConflictPopup(that, cb);
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  render() {
    let deliverableType = this.state.deliverableType;
    return (
      <div>
        <div ref="inProgressRef">
          <div className="status-content in-progress-status">
          {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') ? 
            <h6>This job is in progress. Here’s a look at your upcoming and completed deliverables{ this.isSeeker() ? '.' : ' for this project.' }</h6>
            :
            <h6>This job is in progress. Here’s a look at your upcoming deliverable{ this.isSeeker() ? '.' : ' for this project.' }</h6>
          }
          </div>
          <div className="in-progress-desktop">
            {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') ?
            <ul className="nav nav-pills nav-justified">
              <li className="active"><a data-toggle="pill" href="#pending_deliverables" onClick={(e) => this.onTabChange(e, TAB_TYPE['PENDING'])}>Pending Deliverables</a></li>
              <li><a data-toggle="pill" href="#past_deliverables" onClick={(e) => this.onTabChange(e, TAB_TYPE['PAST'])}>Past Due Deliverables</a></li>
              <li><a data-toggle="pill" href="#completed_deliverables" onClick={(e) => this.onTabChange(e, TAB_TYPE['COMPLETED'])}>Completed Deliverables</a></li>
            </ul>
            :
            <ul className="nav nav-pills nav-justified">
              <li className="active"><a data-toggle="pill" href="#pending_deliverables" onClick={(e) => this.onTabChange(e, TAB_TYPE['PENDING'])}>Pending Deliverables</a></li>
              <li><a data-toggle="pill" href="#completed_deliverables" onClick={(e) => this.onTabChange(e, TAB_TYPE['COMPLETED'])}>Completed Deliverables</a></li>
            </ul>
            }
            {!(this.state.jobType == '1099' && this.state.paymentType == 'Hourly Rate/Fixed Fee') ? 
            <div className="tab-content">
              <div id="pending_deliverables" className="tab-pane fade in active">
                {
                  deliverableType === TAB_TYPE['PENDING'] && this.getDeliverables(TAB_TYPE['PENDING'])
                }
              </div>{/*tab-pane*/}

              <div id="past_deliverables" className="tab-pane fade">
                {
                  deliverableType === TAB_TYPE['PAST'] && this.getDeliverables(TAB_TYPE['PAST'])
                }
              </div>

              <div id="completed_deliverables" className="tab-pane fade">
                {
                  deliverableType === TAB_TYPE['COMPLETED'] && this.getDeliverables(TAB_TYPE['COMPLETED'])
                }
              </div>
            </div>
            :
            <div className="tab-content">
              <div id="pending_deliverables" className="tab-pane active">
                {
                  deliverableType === TAB_TYPE['PENDING'] && this.getDeliverables(TAB_TYPE['PENDING'])
                }
              </div>
              <div id="completed_deliverables" className="tab-pane fade">
                {
                  deliverableType === TAB_TYPE['COMPLETED'] && this.getDeliverables(TAB_TYPE['COMPLETED'])
                }
              </div>
            </div>
            }
          </div>{/*in-progress-desktop*/}

          <div className="in-progress-responsive">
            <div id="deliverables_carousel" className="carousel slide custom-carousel" data-ride="carousel" data-interval="false">
              <div className="carousel-inner mb-15">
                <span className="item active" data-tab-type={TAB_TYPE['PENDING']}>
                  Pending Deliverables
                </span>
                <span className="item" data-tab-type={TAB_TYPE['PAST']}>
                  Past Due Deliverables
                </span>
                <span className="item" data-tab-type={TAB_TYPE['COMPLETED']}>
                  Completed Deliverables
                </span>
              </div>
              {/*Left and right controls*/}
              <a className="left carousel-control" href="#deliverables_carousel" data-slide="prev">
                <i className="fa fa-angle-left"></i>
              </a>
              <a className="right carousel-control" href="#deliverables_carousel" data-slide="next">
                <i className="fa fa-angle-right"></i>
              </a>
            </div>
            {/*carousel*/}
            <div className="separator"></div>
            {
              this.getResponsiveDeliverables(deliverableType)
            }
            {/*in-progress-responsive*/}
          </div>
        </div>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </div>
    );
  }
}
