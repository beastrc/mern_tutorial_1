import React from 'react';
import { Link } from 'react-router';

import { Dashboard, PostJobComp } from '../../index';
import { constant } from '../../../shared/index';

export default class EditAJob extends React.Component {
  constructor (props) {
    super(props);
    this.jobId = this.props.params.jobId;
  }

  render() {
    let myPostedJobsPath = constant['ROUTES_PATH']['MY_POSTED_JOBS'];

    return (
      <Dashboard>
        <section className="job-details-wrapper">
          <div className="section-head">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
              <li className="breadcrumb-item active">Job Posting</li>
                <p>
                  <Link to={ myPostedJobsPath }>My Jobs</Link><i className="fa fa-angle-right mr-15 ml-15" aria-hidden="true"></i>
                  <Link to={ myPostedJobsPath + '/' + this.jobId }>Job Detail</Link><i className="fa fa-angle-right mr-15 ml-15" aria-hidden="true"></i> Edit Job
                </p>
            </ol>
          </div>
          <PostJobComp isEditJobPage={true} jobId={this.jobId}></PostJobComp>
        </section>
        <span className="clearfix"></span>
      </Dashboard>
    );
  }
}
