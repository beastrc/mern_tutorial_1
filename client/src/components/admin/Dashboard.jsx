import React from 'react';

import { constant, utils } from '../../shared/index';

export default class AdminDashboard extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      loaded : true,
    }
    this.exportUsers = this.exportUsers.bind(this);
    this.exportPostJobs = this.exportPostJobs.bind(this);
    this.getCsvFileName = this.getCsvFileName.bind(this);
  }

  getCsvFileName(type) {
    return (type + '_' + utils.getDate() + '_' + utils.getTime() + '.csv');
  }

  exportUsers() {
    var _this = this;
    this.setState({loaded:false}, function() {
      utils.apiCall('EXPORT_USERS', {}, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while exporting Users');
          utils.logger('error', 'Export Users Error -->', err);
        } else {
          if (utils.isResSuccess(response)) {
            var blob = new Blob([response.data],{type: "text/csv;charset=utf-8;"});
            if (navigator.msSaveBlob) { // IE 10+
              navigator.msSaveBlob(blob, _this.getCsvFileName('users'));
            } else {
              var link = document.createElement("a");
              if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", _this.getCsvFileName('users'));
                // link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }
          } else {
            utils.flashMsg('show', (utils.getServerErrorMsg(response) || constant.OOPS_ERROR));
          }
        }
        setTimeout(() => {
          _this.setState({loaded:true})
        }, 500);
      })
    });
  }

  exportPostJobs() {
    var _this = this;
    this.setState({loaded:false}, function() {
      utils.apiCall('EXPORT_POST_JOBS', {}, function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while exporting Post Jobs');
          utils.logger('error', 'Export Post Jobs Error -->', err);
        } else {
          if (utils.isResSuccess(response)) {
            var blob = new Blob([response.data],{type: "text/csv;charset=utf-8;"});
            if (navigator.msSaveBlob) { // IE 10+
              navigator.msSaveBlob(blob, _this.getCsvFileName('post_jobs'));
            } else {
              var link = document.createElement("a");
              if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", _this.getCsvFileName('post_jobs'));
                // link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }
          } else {
            utils.flashMsg('show', (utils.getServerErrorMsg(response) || constant.OOPS_ERROR));
          }
        }
        setTimeout(() => {
          _this.setState({loaded:true})
        }, 500);
      })
    });
  }

  render() {
    return (
      <div>
        <div className="thank-you-container content-wrapper container">
          <div className="thank-you-form form">
            <div className="thank-you-card card">
              <button type="button" className="btn" onClick={this.exportUsers}>Export users</button>
              <button type="button" className="btn" onClick={this.exportPostJobs}>Export post jobs</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
