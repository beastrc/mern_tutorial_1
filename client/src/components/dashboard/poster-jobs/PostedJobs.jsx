import React from 'react';
import { Link } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import Pagination from 'react-js-pagination';

import { Dashboard, Job, NoRecordFound } from '../../index';
import { constant, utils, cookieManager } from '../../../shared/index';

export default class PostedJobs extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      activePage: 1,
      jobRecords: [],
      userRelatedData: '',
      totalJobCount: 0,
      isResponse: false
    };
    this.getPostedJobs = this.getPostedJobs.bind(this);
    this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  getFilterData(filterArr = [], filterId) {
    return filterArr.filter(function(filter) {
      return filter._id == filterId;
    });
  }

  getAllDropdownsData() {
    let that = this;
    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);
          that.setState({
            userRelatedData: data
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  getPostedJobs() {
    let that = this;
    utils.apiCall('GET_POSTED_JOBS', { 'params': [that.state.activePage] }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Posted Jobs');
        utils.logger('error', 'Get Posted Jobs Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          window.scrollTo(0, 0);
          let responseData = utils.getDataFromRes(response);
          let jobRecords = responseData.jobs;
          let totalJobCount = responseData.count;
          that.setState({
            jobRecords: jobRecords,
            totalJobCount: totalJobCount
          });
        } else {
          utils.logger('warn', utils.getServerErrorMsg(response));
        }
        that.setState({
          isResponse: true
        });
      }
    })
  }

  handlePageChange(pageNumber) {
    utils.changeUrl(constant['ROUTES_PATH']['MY_POSTED_JOBS'] + '?page=' + pageNumber);
    this.loadSearchData();
  }

  loadSearchData() {
    let page = utils.getParameterByName('page');
    if(!page) {
      page = 1;
    }
    this.setState({
      activePage: Number(page)
    }, function() {
      this.getPostedJobs();
    });
  }

  componentDidMount() {
    this.getAllDropdownsData();
    this.loadSearchData();
  }

  render() {
    var jobRecordsLength = this.state.jobRecords.length;
    var jobs = this.state.jobRecords.map(function(job){
      job.fromRoute = 'POSTED_JOBS';
      return (
        <Job key={job._id} job={job} userRelatedData={this.state.userRelatedData} />
      )
    }.bind(this));

    return (
      <Dashboard>
        <ToastContainer />
        <section className="job-details-wrapper">
          <div className="section-head">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
              <li className="breadcrumb-item active">Job Posting</li>
              <p>My Jobs</p>
            </ol>
          </div>
          <div className="job-search-card mb-30">
            <div className="card-head hide"></div>
            { this.state.isResponse ? (jobRecordsLength > 0 ? <div>{jobs}</div> : <NoRecordFound />) : null }
          </div>
          { this.state.totalJobCount > 0 ?
            <div>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.itemsCountPerPage}
                totalItemsCount={this.state.totalJobCount}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
              />
              <span className="clearfix"></span>
            </div>
            : ''
          }
        </section>
        <span className="clearfix"></span>
      </Dashboard>
    );
  }
}
