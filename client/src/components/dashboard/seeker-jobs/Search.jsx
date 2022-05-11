import React from 'react';
import Pagination from '../shared/Pagination'
import Select from 'react-select';
import _ from 'lodash';
import { Dropdown, MenuItem } from 'react-bootstrap';

import { Dashboard, Job, NoRecordFound } from '../../index';
import { constant, utils, cookieManager } from '../../../shared/index';
import ModalPopup from '../../shared/modal-popup/ModalPopup';


export default class JobSearch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      jobRecords: [],
      activePage: 1,
      totalJobCount: 0,
      itemsCountPerPage: 10,
      userRelatedData: '',
      isResponse: false,
      modalPopupObj: {},
      freezeActivity: false,
      practice_area_dropdown:[],
      state_dropdown: [],
      practiceAreas: [],
      states: [],
      selectedOrder: '-1'
    };

    this.getJobListings = this.getJobListings.bind(this);
    this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.setMultiSelectValues = this.setMultiSelectValues.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleOrderSelect = this.handleOrderSelect.bind(this);
  }

  getFilterData(filterArr = [], filterId) {
    return filterArr.filter(function(filter) {
      return filter._id == filterId;
    });
  }

  getAllDropdownsData() {
    const that = this;
    const practiceAreas = [];
    const states = [];

    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);

          for (let pAreasObj of data['practice_areas']) {
            practiceAreas.push({value: pAreasObj['_id'], label: pAreasObj['name']});
          }

          for (let statesObj of data['states']) {
            states.push({value: statesObj['_id'], label: statesObj['name']});
          }

          that.setState({
            practice_area_dropdown: practiceAreas,
            state_dropdown: states,
            userRelatedData: data
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  getJobListings(){
    let that = this;
    const { practiceAreas, states, activePage, selectedOrder } = this.state
    const selectedStates = _.map(states, 'value');

    const data = {
      practiceAreas,
      selectedOrder,
      states: selectedStates
    }

    utils.apiCall('GET_JOBS', {
       'params': [activePage],
       'data': data
      }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Jobs');
        utils.logger('error', 'Get Jobs Error -->', err);
      } else {
        if (response.data.Code == 200 && response.data.Status == true) {
          window.scrollTo(0, 0);
          let responseData = response.data.Data;
          let jobRecords = responseData.data;
          let totalJobCount = responseData.count;
          that.setState({
            jobRecords: jobRecords,
            totalJobCount: totalJobCount,
            freezeActivity: responseData.userData.freeze_activity,
            isBarIdValid: responseData.userData.is_bar_id_valid
          });
        } else {
          utils.logger('warn', utils.getServerErrorMsg(response));
        }
        that.setState({
          isResponse: true
        });
      }
    });
  }

  handlePageChange(pageNumber) {
    utils.changeUrl(constant['ROUTES_PATH']['JOB_SEARCH'] + '?page=' + pageNumber);
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
      this.getJobListings();
    });
  }

  setMultiSelectValues (val, key) {
    var stateObj = this.state;
    stateObj[key] = val;
    this.setState(stateObj)
  }

  handleSearch () {
    this.setState(
      {
        activePage: 1,
      },
      function() {
        this.getJobListings()
      }
    );
  }

  componentDidMount() {
    this.getAllDropdownsData();
    this.loadSearchData();
  }

  handleOrderSelect (eventKey, event) {
    this.setState(
      {
        activePage: 1,
        selectedOrder: eventKey
      },
      function() {
        this.getJobListings()
      }
    );
  }

  render() {
    const { practiceAreas, states, jobRecords, selectedOrder, activePage, itemsCountPerPage, totalJobCount } = this.state
    const totalPageCount = Math.ceil(totalJobCount / itemsCountPerPage)
    const jobRecordsLength = jobRecords.length;
    const jobs = jobRecords.map(function(job) {
      job.fromRoute = 'SEARCH_JOBS';
      job.step = job.job_step;
      job.nTermStatus = (job.n_terms_status && job.n_terms_status.length) ? job.n_terms_status[0] : 0;
      job.declinedBy = job.declined_by || '';
      job.modalPopupObj = this;
      return (
        <Job key={job._id} job={job} userRelatedData={this.state.userRelatedData} freezeActivity={this.state.freezeActivity} isBarIdValid={this.state.isBarIdValid}/>
      )
    }.bind(this));

    return (
      <Dashboard>
        <section className="job-search-wrapper">
          <div className="section-head">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
              <li className="breadcrumb-item active">Job Searching</li>
              <p>Job Search</p>
            </ol>
          </div>
          <div className="job-search-card mb-30 column-flex">
            <div className="card-head hide"></div>
            <div className="search-filter-box m-30">
              <div className="date-filter-box">
                <Dropdown onSelect={this.handleOrderSelect} className='dropdown-container' id={`dropdown-basic-primary`}>
                  <Dropdown.Toggle className = 'dropdown-order-toggle'>
                    {
                      selectedOrder === '1'
                      ? 'Posted Date (oldest First)'
                      : 'Posted Date (newest First)'
                    }
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <MenuItem eventKey = '-1'>Posted Date (Newest First)</MenuItem>
                    <MenuItem eventKey = '1'>Posted Date (Oldest First)</MenuItem>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div>
                <div className="col-sm-5">
                  <div className="form-group">
                    <label className="control-label">Practice Area</label>
                    <Select multi closeOnSelect = {false} onBlurResetsInput = {true} autosize = {false}
                      onChange={(val) => this.setMultiSelectValues(val, 'practiceAreas')}
                      options={this.state.practice_area_dropdown}
                      placeholder="Select Practice Area(s)"
                      value={practiceAreas} />
                  </div>
                </div>
                <div className="col-sm-5">
                  <div className="form-group">
                    <label className="control-label">State</label>
                    <Select multi closeOnSelect = {false} onBlurResetsInput = {true} autosize = {false}
                      onChange={(val) => this.setMultiSelectValues(val, 'states')}
                      options={this.state.state_dropdown}
                      placeholder="Select State(s)"
                      value={states} />
                  </div>
                </div>
                <button type="button" className="btn ml-10 btn-primary mt-30" onClick={this.handleSearch}>
                    Search
                </button>
              </div>
            </div>
            { this.state.isResponse ? (jobRecordsLength > 0 ? <div>{jobs}</div> : <NoRecordFound name="Jobs"/>) : null }
          </div>
          { this.state.totalJobCount > 0 ?
            <div>
              <Pagination
                activePage={this.state.activePage}
                totalPageCount={totalPageCount}
                onChange={this.handlePageChange}
              />
              <span className="clearfix"></span>
            </div>
          : '' }
        </section>
        <span className="clearfix"></span>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </Dashboard>
    );
  }
}
