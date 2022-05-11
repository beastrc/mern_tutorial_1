import React from 'react';
import Rating from 'react-rating';
import classNames from 'classnames'
import { config, constant, helper, utils } from '../../../../shared/index';

export default class JobComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInfoHovered: false,
      currentRating: 3,
      isSaved: false
    };

    this.hoverOnInfo = this.hoverOnInfo.bind(this);
    this.hoverOffInfo = this.hoverOffInfo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
  }

  handleSubmit() {
    const {currentRating} = this.state;
    const {role, jobId, stepRelatedData} = this.props;

    const req = {
      role,
      jobId,
      rating: currentRating
    }

    utils.apiCall('SAVE_RATING', {'data': req}, (err, response) => {
      if (err) {
        utils.flashMsg('show', 'Error while saving the rating');
        utils.logger('error', 'Save rating error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          this.setState({
            isSaved: true
          })
        }
      }
    })
  }

  handleStarClick(value) {
    this.setState({currentRating: value})
  }

  hoverOnInfo() {
    this.setState({
      isInfoHovered: true
    });
  }

  hoverOffInfo() {
    this.setState({
      isInfoHovered: false
    });
  }

  showStarGroup(fullStar) {
    const stars = [];

    for (let i = 1; i <= 4; i++) {
      let element = null;

      if (i <= fullStar) {
        element = <i key={i} className="fa fa-star fa-2x" aria-hidden="true" />;
      } else {
        element = <i key={i} className="fa fa-star-o fa-2x" aria-hidden="true" />;
      }

      stars.push(element);
    }

    return stars;
  }

  render() {
    const isSeeker = this.props.role === constant['ROLE']['SEEKER'];
    const { isInfoHovered, currentRating, isSaved } = this.state;
    const ratingBtnClass = classNames("btn", "ml-30", {"btn-applied": isSaved, "btn-primary": !isSaved})

    return (
      <div>
        <div className="status-content mt-45">
          {isSeeker ? "Nice work! You've completed this job." : 'All milestones for this job have been completed.'}
        </div>
        <div className="status-content mt-15">
          Please rate your experience with this
          {isSeeker ? ' hiring manager': ' candidate'}
          <span className="rating-info-icon">
            <i onMouseEnter={this.hoverOnInfo} onMouseLeave={this.hoverOffInfo} className="fa fa-question-circle-o ml-5" aria-hidden="true" />
            {isInfoHovered && (
              <div className="rating-info-box pl-10">
                <div className="each-detail">
                  {this.showStarGroup(1)}
                  <span>
                    <h5> Would never work with them again</h5>
                  </span>
                </div>
                <div className="each-detail">
                  {this.showStarGroup(2)}
                  <span>
                    <h5> Would consider working with them again</h5>
                  </span>
                </div>
                <div className="each-detail">
                  {this.showStarGroup(3)}
                  <span>
                    <h5> Would want to work with them again</h5>
                  </span>
                </div>
                <div className="each-detail">
                  {this.showStarGroup(4)}
                  <span>
                    <h5> Would definitely want to work with them again</h5>
                  </span>
                </div>
              </div>
            )}
          </span>
        </div>
        <div className="rating-box mt-20 ml-10">
          <Rating
            className="star-rating ml-10"
            emptySymbol="fa fa-star-o fa-2x"
            fullSymbol="fa fa-star fa-2x"
            stop={4}
            initialRating={currentRating}
            onClick={this.handleStarClick}/>
          <button type="button" className={ratingBtnClass} disabled={isSaved} onClick={this.handleSubmit}>
            {!isSaved ? 'Save rating' : 'Saved'}
          </button>
        </div>
      </div>
    );
  }
}
