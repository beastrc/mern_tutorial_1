import React from 'react';
import { Link } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Pagination from '../shared/Pagination';
// import { Truncate } from 'react-read-more';
import ReadMoreReact from 'read-more-react';
import Select from 'react-select';
import _ from 'lodash';

import { Dashboard, NoRecordFound } from '../../index';
import { constant, utils, helper } from '../../../shared/index';
import config from '../../../shared/config';
import ModalPopup from '../../shared/modal-popup/ModalPopup';

export default class CandidateSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCandidateCount: 0,
      candidateData: [],
      filteredCandidateData: [],
      isResponse: false,
      practice_area_dropdown: [],
      state_dropdown: [],
      practiceAreas: [],
      states: [],
      activePage: 1,
      itemsCountPerPage: 10,
      modalPopupObj: {}
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.setMultiSelectValues = this.setMultiSelectValues.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCandidateInvite = this.handleCandidateInvite.bind(this);
  }

  componentDidMount() {
    let that = this;
    const practiceAreaList = utils.getListData('practice_areas');
    const statesList = utils.getListData('states');
    const practiceAreas = [];
    const states = [];

    for (let pAreasObj of practiceAreaList) {
      practiceAreas.push({ value: pAreasObj['_id'], label: pAreasObj['name'] });
    }

    for (let statesObj of statesList) {
      states.push({ value: statesObj['_id'], label: statesObj['name'] });
    }

    that.setState({
      practice_area_dropdown: practiceAreas,
      state_dropdown: states
    });

    utils.apiCall('GET_CANDIDATES_DATA', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Candidates data');
        utils.logger('error', 'Get Candidate Data Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          const pageData = response.data.data.slice(
            0,
            that.state.itemsCountPerPage
          );

          that.setState({
            candidateData: response.data.data,
            filteredCandidateData: response.data.data,
            totalCandidateCount: response.data.data.length,
            pageData: pageData
          });
        }
      }
    });
  }

  setMultiSelectValues(val, key) {
    var stateObj = this.state;
    stateObj[key] = val;
    this.setState(stateObj);
  }

  handlePageChange(pageNumber) {
    this.setState({
      activePage: pageNumber
    });
  }

  getPhotoUrl(imgPath) {
    let photoUrl = constant['IMG_PATH'] + 'default-profile-pic.png';
    if (imgPath) {
      let apiConfig = config.getConfiguration();
      photoUrl = apiConfig.S3_BUCKET_URL + imgPath;
    }
    return photoUrl;
  }

  profileImgError(evt) {
    return utils.onImgError(evt, '/images/default-profile-pic.png');
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

  userDetailLink(userId) {
    let routesPath = constant['ROUTES_PATH'];
    return {
      pathname: routesPath['PROFILE'] + '/' + userId,
      state: {
        jobId: this.props.jobId,
        isCandidate: true
      }
    };
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

  handleSearch() {
    const { practiceAreas, states, candidateData } = this.state;

    const filteredCandidatesArray = candidateData.filter(candidate => {
      const jobArea = candidate.job_seeker_info.basic_profile.practice_area_id,
        selectedArea = _.map(practiceAreas, 'value'),
        selectedStates = _.map(states, 'value'),
        jobState =
          candidate.job_seeker_info.job_profile.willing_to_work_location_id;

      const practiceAreaMatched =
        practiceAreas.length === 0 ||
        _.intersection(jobArea, selectedArea).length > 0;
      const stateMatched =
        states.length === 0 ||
        _.intersection(jobState, selectedStates).length > 0;

      return practiceAreaMatched && stateMatched;
    });

    const filteredTotalCount = filteredCandidatesArray.length;

    this.setState({
      filteredCandidateData: filteredCandidatesArray,
      totalCandidateCount: filteredTotalCount
    });
  }

  handleCandidateInvite(item) {
    helper.openSendMessagePopup(this, item._id, true);
  }

  render() {
    const {
      filteredCandidateData,
      totalCandidateCount,
      practiceAreas,
      states,
      itemsCountPerPage,
      activePage,
      modalPopupObj
    } = this.state;
    const pageData = filteredCandidateData.slice(
      itemsCountPerPage * (Number(activePage) - 1),
      itemsCountPerPage * Number(activePage)
    );
    const totalPageCount = Math.ceil(
      filteredCandidateData.length / itemsCountPerPage
    );

    return (
      <Dashboard>
        <ToastContainer />
        <section className="job-details-wrapper">
          <div className="section-head">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
              <li className="breadcrumb-item active">Job Posting</li>
              <p>Candidate Search</p>
            </ol>
          </div>
          <div className="bg-white clearfix pb-30">
            <div className="search-filter-box m-30">
              <div className="col-sm-5">
                <div className="form-group">
                  <label className="control-label">Practice Area</label>
                  <Select
                    multi
                    closeOnSelect={false}
                    onBlurResetsInput={true}
                    autosize={false}
                    onChange={val =>
                      this.setMultiSelectValues(val, 'practiceAreas')
                    }
                    options={this.state.practice_area_dropdown}
                    placeholder="Select Practice Area(s)"
                    value={practiceAreas}
                  />
                </div>
              </div>
              <div className="col-sm-5">
                <div className="form-group">
                  <label className="control-label">State</label>
                  <Select
                    multi
                    closeOnSelect={false}
                    onBlurResetsInput={true}
                    autosize={false}
                    onChange={val => this.setMultiSelectValues(val, 'states')}
                    options={this.state.state_dropdown}
                    placeholder="Select State(s)"
                    value={states}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn ml-10 btn-primary mt-30"
                onClick={this.handleSearch}
              >
                Search
              </button>
            </div>
            <div className="status-content mt-45">
              <div className="candidates-applied column-flex">
                {pageData.length > 0 ? (
                  pageData.map((item, index) => (
                    <div key={index} className="candidate-data ml-30 mr-30">
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
                        <div className="para mt-10 mb-20" style={{color: '#666666'}}>
                          <ReadMoreReact 
                            text={item.job_seeker_info.network.about_lawyer}
                            min={80}
                            ideal={300}
                            className="para mt-10 mb-20"
                            max={500}
                            readMoreText="read more"/>
                            {/*<Truncate
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
                            */}
                        </div>
                        <div className="buttons text-right">
                          <button
                            type="button"
                            className="btn btn-primary mr-10"
                            onClick={() => this.handleCandidateInvite(item)}
                          >
                            Invite
                          </button>
                          <Link to={this.userDetailLink(item._id)}>
                            <button
                              type="button"
                              className="btn btn-primary ml-10"
                            >
                              View Profile
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoRecordFound name="Candidates" />
                )}
              </div>
            </div>
          </div>
          {totalCandidateCount > 0 ? (
            <div>
              <Pagination
                activePage={activePage}
                totalPageCount={totalPageCount}
                onChange={this.handlePageChange}
              />
              <span className="clearfix"></span>
            </div>
          ) : (
            ''
          )}
        </section>
        <span className="clearfix"></span>
        <ModalPopup modalPopupObj={modalPopupObj} />
      </Dashboard>
    );
  }
}
