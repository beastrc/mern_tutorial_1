import React from 'react';

import { Dashboard, PostJobComp } from '../../index';

export default class PostAJob extends React.Component {
  render() {
    return (
      <Dashboard>
        <section className="job-details-wrapper">
          <div className="section-head">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
              <li className="breadcrumb-item active">Job Posting</li>
                <p>Post a Job</p>
            </ol>
          </div>
          <PostJobComp isEditJobPage={false} jobId={null}></PostJobComp>
        </section>
        <span className="clearfix"></span>
      </Dashboard>
    );
  }
}
