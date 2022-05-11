import React from 'react';
import Dropzone from 'react-dropzone';

import { Role, AvatarCropper, AvatarFileUpload } from '../../../index';
import {
  constant,
  utils,
  cookieManager,
  config
} from '../../../../shared/index';
import ModalPopup from '../../../shared/modal-popup/ModalPopup';

export default class Headline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      network: {
        lawyer_headline: '',
        about_lawyer: '',
        linkedin_link: ''
      },
      formErrors: {
        lawyer_headline: '',
        about_lawyer: '',
        linkedin_link: '',
        resume: '',
        photo: '',
        writing_samples: ''
      },
      lawerHeadlineValid: false,
      aboutLawyerValid: false,
      linkedinValid: false,
      resumeValid: false,
      photoValid: false,
      sampleValid: true,
      userId: '',
      showPopup: false,
      completeStatus: '',
      resumeObj: {},
      cropperOpen: false,
      img: null,
      croppedImg: '/images/upload_image_placeholder.png',
      imgObj: {},
      sampleObj: {},
      accepted: [],
      rejected: [],
      sampleArray: [],
      writing_samples: '',
      maxSize: 3000000,
      multiple: false,
      resumeName: '',
      photoUpdate: false,
      resumeUpdate: false,
      samplesUpdate: false,
      photoLink: '',
      resumeLink: '',
      alreadyAccepted: [],
      deleteDisabled: true,
      expand: true,
      editProfile: false,
      userImage: '',
      profileComplete: false,
      modalPopupObj: {},
      photoUrl: ''
    };
    this._handleClick = this._handleClick.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.handleRequestHide = this.handleRequestHide.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDropFile = this.onDropFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.deleteResume = this.deleteResume.bind(this);
    this.clearInputValue = this.clearInputValue.bind(this);
    this.expandHide = this.expandHide.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.profileImgError = this.profileImgError.bind(this);
    this.onImageCrossIconClick = this.onImageCrossIconClick.bind(this);
  }
  onDropFile(accepted, rejected, evt) {
    evt.target.value = null;
    if (accepted.length > 0) {
      let error = this.state.formErrors;
      error.resume = '';
      if (accepted[0]) {
        let resumeFile = accepted[0];
        let _this = this;
        this.state.resumeObj.name = accepted[0].name;
        this.state.resumeObj.size = accepted[0].size;
        this.state.resumeObj.type = accepted[0].type;
        this.setState({
          resumeValid: true,
          formErrors: error,
          resumeName: accepted[0].name
        });
        var fileReader = new FileReader();
        fileReader.readAsDataURL(resumeFile);
        fileReader.onload = function(event) {
          _this.state.resumeObj.dataUrl =
            event.target.result; /*add dataUrl to file properties*/
          _this.setState({
            resumeObj: _this.state.resumeObj,
            resumeUpdate: true
          });
        };
      }
    } else {
      let filetype = rejected[0].type;
      var ext = filetype.substr(filetype.lastIndexOf('/') + 1);
      var validFormats = [
        'pdf',
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
        'msword'
      ];
      if (validFormats.indexOf(ext) == -1) {
        let error = this.state.formErrors;
        error.resume = constant.INVALID_FILE_FORMAT;
        this.setState({
          resumeValid: false,
          formErrors: error,
          resumeName: rejected[0].name
        });
      } else if (rejected[0].size / 1000000 > 3) {
        let error = this.state.formErrors;
        error.resume = constant.RESUME_SIZE_ERROR;
        this.setState({
          resumeValid: false,
          formErrors: error,
          resumeName: rejected[0].name
        });
      }
    }
  }

  profileImgError(evt) {
    this.setState({ deleteDisabled: true });
    return utils.onImgError(evt, '/images/upload_image_placeholder.png');
  }

  clearInputValue(e) {
    e.target.value = null;
  }

  deleteResume(e) {
    let error = this.state.formErrors;
    error.resume = '';
    this.state.resumeObj = {};
    this.setState({
      resumeValid: true,
      formErrors: error,
      resumeName: '',
      resumeObj: this.state.resumeObj,
      resumeUpdate: true,
      deleteResumeLink: this.state.resumeLink
    });
  }

  onDrop(accepted, rejected, evt) {
    rejected = this.state.rejected.concat(rejected);
    evt.target.value = null;
    this.setState({ rejected: rejected });
    if (rejected.length == 0) {
      let error = this.state.formErrors;
      error.writing_samples = '';
      this.setState({ sampleValid: true, formErrors: error });
    } else {
      this.setState({ sampleValid: false });
      let counter = 0;
      rejected.forEach(file => {
        var ext = file.type.substr(file.type.lastIndexOf('/') + 1);
        var validFormats = [
          'pdf',
          'vnd.openxmlformats-officedocument.wordprocessingml.document',
          'msword'
        ];
        if (validFormats.indexOf(ext) == -1) {
          file.error = constant.INVALID_FILE_FORMAT;
          count++;
        } else if (file.size / 1000000 > 3) {
          file.error = constant.RESUME_SIZE_ERROR;
          count++;
        }

        if (count == rejected.length) {
          this.setState({ rejected: rejected, sampleValid: false });
        }
      });
    }

    let count = 0;
    let acceptedArr = [];
    accepted.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        let tempObj = {
          name: file['name'],
          size: file['size'],
          type: file['type'],
          dataUrl: event['target']['result']
        };
        acceptedArr.push(tempObj);
        count++;
        if (count == accepted.length) {
          acceptedArr = this.state.accepted.concat(acceptedArr);
          this.setState({ accepted: acceptedArr, samplesUpdate: true });
        }
      };
    });
  }

  getUserProfile(isForceUpdateHeader) {
    let apiConfig = config.getConfiguration();
    let s3BucketUrl = apiConfig.S3_BUCKET_URL;

    var _this = this;
    utils.apiCall(
      'GET_USER_PROFILE',
      { params: ['job_seeker_info', 'job_posters_info'] },
      function(err, response) {
        if (err) {
          utils.flashMsg('show', 'Error while getting User Profile');
          utils.logger('error', 'Get User Profile Error -->', err);
        } else {
          if (response.data.Code == 200 && response.data.Status == true) {
            if (
              response.data.Data.job_seeker_info.is_profile_completed == 'Y'
            ) {
              _this.setState({ editProfile: true, profileComplete: true });
            } else {
              _this.setState({ editProfile: false, profileComplete: false });
            }
            var userData = utils.getCurrentUser();
            var photoUrl = response.data.Data.job_seeker_info.network.photo;
            if (userData) {
              var image = photoUrl ? s3BucketUrl + photoUrl : '';
              _this.setState({ userImage: image });
              userData.image = image;
              cookieManager.setObject('currentUser', userData);
            }
            _this.setState({
              completeStatus:
                response.data.Data.job_seeker_info.last_visited_page
            });
            if (response.data.Data.job_seeker_info.network) {
              _this.setState({
                network: response.data.Data.job_seeker_info.network
              });
            }
            if (!!response.data.Data.job_seeker_info.network.resume) {
              _this.state.resumeLink =
                response.data.Data.job_seeker_info.network.resume;
              var resumeName = _this.state.resumeLink.substr(
                _this.state.resumeLink.lastIndexOf('/') + 1
              );
              _this.setState({
                resumeName: resumeName,
                resumeLink: _this.state.resumeLink
              });
            }
            if (
              response.data.Data.job_seeker_info.network.writing_samples
                .length > 0
            ) {
              _this.setState({
                alreadyAccepted:
                  response.data.Data.job_seeker_info.network.writing_samples
              });
            }
            if (!!photoUrl) {
              _this.state.photoLink = s3BucketUrl + photoUrl;
              // var photoName = photoLink.substr(photoLink.lastIndexOf('/') + 1);
              if (_this.state.photoLink) {
                _this.state.deleteDisabled = false;
              } else {
                _this.state.deleteDisabled = true;
              }
              _this.setState({
                croppedImg: _this.state.photoLink,
                deleteDisabled: _this.state.deleteDisabled,
                photoLink: _this.state.photoLink,
                photoUrl: photoUrl
              });
            }

            if (isForceUpdateHeader) {
              _this.props.forceUpdateHeader();
            }
          } else {
            utils.flashMsg('show', response.data.Message);
          }
        }
      }
    );
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    $('input[type="file"]').attr('title', ' ');
    var userData = utils.getCurrentUser();
    if (userData) {
      this.setState({ token: userData.token, userId: userData.userId });
    }
    this.getUserProfile(false);
  }

  deleteFile(from, index) {
    if (from == 'accepted') {
      this.state.accepted.splice(index, 1);
      this.setState({ accepted: this.state.accepted });
    } else if (from == 'alreadyAccepted') {
      this.state.alreadyAccepted.splice(index, 1);
      this.setState({ alreadyAccepted: this.state.alreadyAccepted });
    } else {
      this.state.rejected.splice(index, 1);
      this.setState({ rejected: this.state.rejected });
      if (this.state.rejected.length == 0) {
        let error = this.state.formErrors;
        error.writing_samples = '';
        this.setState({ sampleValid: true, formErrors: error });
      } else {
        this.setState({ sampleValid: false });
      }
    }
  }

  _handleClick(e) {
    let callFrom = e.target.name;
    let fieldValidationErrors = this.state.formErrors;
    let networkData = this.state.network;
    switch ('photo') {
      case 'photo':
        if (fieldValidationErrors.photo == '') {
          this.state.photoValid = true;
          this.state.formErrors.photo = '';
        } else {
          this.state.photoValid = false;
        }
      case 'lawyer_headline':
        if (!!networkData.lawyer_headline) {
          if (networkData.lawyer_headline.length <= 150) {
            this.state.lawerHeadlineValid = true;
            fieldValidationErrors.lawyer_headline = '';
          } else {
            this.state.lawerHeadlineValid = false;
            fieldValidationErrors.lawyer_headline =
              constant.INVALID_LAWYER_HEADLINE_LENGTH;
          }
        } else {
          this.state.lawerHeadlineValid = true;
          fieldValidationErrors.lawyer_headline = '';
        }

      case 'about_lawyer':
        if (!!networkData.about_lawyer) {
          if (networkData.about_lawyer.length <= 700) {
            this.state.aboutLawyerValid = true;
            fieldValidationErrors.about_lawyer = '';
          } else {
            this.state.aboutLawyerValid = false;
            fieldValidationErrors.about_lawyer =
              constant.INVALID_ABOUT_ME_LENGTH;
          }
        } else {
          this.state.aboutLawyerValid = true;
          fieldValidationErrors.about_lawyer = '';
        }
      case 'linkedin_link':
        if (!!networkData.linkedin_link) {
          let link = networkData.linkedin_link.toLowerCase();
          // let regx = new RegExp('(ftp|http|https):\/\/?(?:www\.)?linkedin.com(\w+:{0,1}\w*@)?(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?', 'i');
          if (
            (link.includes('https://') ||
              link.includes('http://') ||
              link.includes('www.')) &&
            link.includes('linkedin.com')
          ) {
            this.state.linkedinValid = true;
            fieldValidationErrors.linkedin_link = '';
          } else {
            this.state.linkedinValid = false;
            fieldValidationErrors.linkedin_link =
              constant.INVALID_LINKEDIN_LINK;
          }
        } else {
          this.state.linkedinValid = true;
          fieldValidationErrors.linkedin_link = '';
        }

      case 'resume':
        if (fieldValidationErrors.resume == '') {
          this.state.resumeValid = true;
          this.state.formErrors.resume = '';
        } else {
          this.state.resumeValid = false;
        }

        break;
      default:
        break;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      photoValid: this.state.photoValid,
      lawerHeadlineValid: this.state.lawerHeadlineValid,
      aboutLawyerValid: this.state.aboutLawyerValid,
      linkedinValid: this.state.linkedinValid,
      resumeValid: this.state.resumeValid,
      sampleValid: this.state.sampleValid,
      photoUpdate: this.state.photoUpdate,
      resumeUpdate: this.state.resumeUpdate
    });
    if (
      this.state.photoValid &&
      this.state.lawerHeadlineValid &&
      this.state.aboutLawyerValid &&
      this.state.linkedinValid &&
      this.state.resumeValid &&
      this.state.sampleValid
    ) {
      const data = {};
      data.job_seeker_info = {};
      data.job_seeker_info.network = this.state.network;
      data.job_seeker_info.network.photo = this.state.imgObj;
      data.job_seeker_info.network.writing_samples = this.state.accepted;
      if (this.state.resumeUpdate == false) {
        data.job_seeker_info.network.resume = this.state.resumeLink;
      } else {
        data.job_seeker_info.network.resume = this.state.resumeObj;
      }
      data.job_seeker_info.network.userId = this.state.userId;
      if (this.state.photoUpdate == false) {
        data.job_seeker_info.network.photo = this.state.photoLink;
      } else {
        data.job_seeker_info.network.photo = this.state.imgObj;
      }
      data.job_seeker_info.network.photoUpdate = this.state.photoUpdate;
      data.job_seeker_info.network.resumeUpdate = this.state.resumeUpdate;
      data.job_seeker_info.network.alreadyAddedSample = this.state.alreadyAccepted;
      if (this.state.deleteResumeLink) {
        data.job_seeker_info.network.deleteResumeLink = this.state.deleteResumeLink;
      }
      if (this.state.deletePhotoLink) {
        data.job_seeker_info.network.deletePhotoLink = this.state.deletePhotoLink;
      }
      var _this = this;

      utils.apiCall('SET_USER_NETWORK_PROFILE', { data: data }, function(
        err,
        response
      ) {
        if (err) {
          utils.flashMsg('show', 'Error while setting User Network Profile');
          utils.logger('error', 'Set User Network Profile Error -->', err);
        } else {
          if (response.data.Code == 200 && response.data.Status == true) {
            if (callFrom == 'save') {
              utils.flashMsg(
                'show',
                constant.SUCCESS_UPDATE_PROFILE,
                'success'
              );
              _this.getUserProfile(true);
            } else {
              utils.changeUrl(constant['ROUTES_PATH']['SEEKER_JOB_TYPE']);
            }
          } else {
            utils.flashMsg('show', response.data.Message);
          }
        }
      });
    }
  }

  handleInputOnBlur(e) {
    this.validateField(e.target.name, e.target.value);
  }

  handleUserInput(e) {
    let network = Object.assign({}, this.state.network);
    network[e.target.name] = e.target.value;
    this.setState({ network });
  }

  handleFileChange(dataURI, imgObj) {
    let fieldValidationErrors = this.state.formErrors;
    if (imgObj.size / 1000000 > 10) {
      fieldValidationErrors.photo = constant.IMAGE_SIZE_ERROR;
      this.state.photoValid = false;
      var cropperOpenStatus = false;
    } else {
      fieldValidationErrors.photo = '';
      this.state.photoValid = true;
      var cropperOpenStatus = true;
    }
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      imgObj: imgObj,
      formErrors: fieldValidationErrors,
      photoValid: this.state.photoValid,
      cropperOpen: cropperOpenStatus
    });
  }
  handleCrop(dataURI) {
    let photoObj = {};
    photoObj.dataUrl = dataURI;
    photoObj.name = this.state.imgObj.name;
    photoObj.size = this.state.imgObj.size;
    photoObj.type = this.state.imgObj.type;
    let photoUrl = this.state.photoUrl || '';
    this.setState({
      cropperOpen: false,
      img: null,
      croppedImg: dataURI,
      imgObj: photoObj,
      photoUpdate: true,
      deleteDisabled: false,
      deletePhotoLink: photoUrl
    });
  }
  handleRequestHide() {
    this.setState({
      cropperOpen: false,
      isMounted: false
    });
  }

  onImageCrossIconClick() {
    let _that = this;
    let popupType = constant['POPUP_TYPES']['CONFIRM'];
    _that.setState(
      {
        modalPopupObj: {
          type: popupType,
          iconImgUrl:
            constant['IMG_PATH'] + 'svg-images/negative-alert-icon.svg',
          msg:
            constant['POPUP_MSG']['CONFIRM_MSG'] +
            constant['POPUP_MSG']['DELETE_PHOTO'],
          noBtnText: 'Cancel',
          yesBtnText: 'OK',
          noBtnAction: function() {
            utils.modalPopup(popupType, 'hide', _that);
          },
          yesBtnAction: function() {
            utils.modalPopup(popupType, 'hide', _that);
            _that.deleteImage();
          }
        }
      },
      function() {
        utils.modalPopup(popupType, 'show', _that);
      }
    );
  }

  deleteImage() {
    let error = this.state.formErrors;
    error.photo = '';
    this.state.imgObj = {};
    this.setState({
      photoValid: true,
      formErrors: error,
      img: null,
      croppedImg: '/images/upload_image_placeholder.png',
      imgObj: this.state.imgObj,
      photoUpdate: true,
      deleteDisabled: true,
      deletePhotoLink: this.state.photoUrl
    });
  }

  expandHide(param) {
    if (param == 'expand') {
      this.setState({ expand: false });
    } else {
      this.setState({ expand: true });
    }
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let networkData = this.state.network;
    switch (fieldName) {
      case 'photo':
        if (fieldValidationErrors.photo == '') {
          this.state.photoValid = true;
          this.state.formErrors.photo = '';
        } else {
          this.state.photoValid = false;
          // this.state.photoValid = true;
          // this.state.formErrors.photo = "";
        }
        break;
      case 'lawyer_headline':
        if (!!networkData.lawyer_headline) {
          if (networkData.lawyer_headline.length <= 150) {
            this.state.lawerHeadlineValid = true;
            fieldValidationErrors.lawyer_headline = '';
          } else {
            this.state.lawerHeadlineValid = false;
            fieldValidationErrors.lawyer_headline =
              constant.INVALID_LAWYER_HEADLINE_LENGTH;
          }
        } else {
          this.state.lawerHeadlineValid = false;
          fieldValidationErrors.lawyer_headline = '';
        }
        break;
      case 'about_lawyer':
        if (!!networkData.about_lawyer) {
          if (networkData.about_lawyer.length <= 700) {
            this.state.aboutLawyerValid = true;
            fieldValidationErrors.about_lawyer = '';
          } else {
            this.state.aboutLawyerValid = false;
            fieldValidationErrors.about_lawyer =
              constant.INVALID_ABOUT_ME_LENGTH;
          }
        } else {
          this.state.aboutLawyerValid = true;
          fieldValidationErrors.about_lawyer = '';
        }
        break;
      case 'linkedin_link':
        if (!!networkData.linkedin_link) {
          let link = networkData.linkedin_link.toLowerCase();
          // let regx = new RegExp('(ftp|http|https):\/\/?(?:www\.)?linkedin.com(\w+:{0,1}\w*@)?(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?', 'i');
          if (
            (link.includes('https://') ||
              link.includes('http://') ||
              link.includes('www.')) &&
            link.includes('linkedin.com')
          ) {
            this.state.linkedinValid = true;
            fieldValidationErrors.linkedin_link = '';
          } else {
            this.state.linkedinValid = false;
            fieldValidationErrors.linkedin_link =
              constant.INVALID_LINKEDIN_LINK;
          }
        } else {
          fieldValidationErrors.linkedin_link = '';
        }
        break;
      case 'resume':
        if (fieldValidationErrors.resume == '') {
          this.state.resumeValid = true;
          this.state.formErrors.resume = '';
        } else {
          this.state.resumeValid = false;
        }
        break;
      case 'writing_samples':
        if (fieldValidationErrors.writing_samples == '') {
          this.state.sampleValid = true;
          this.state.formErrors.writing_samples = '';
        } else {
          this.state.sampleValid = false;
        }
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        photoValid: this.state.photoValid,
        lawerHeadlineValid: this.state.lawerHeadlineValid,
        aboutLawyerValid: this.state.aboutLawyerValid,
        linkedinValid: this.state.linkedinValid,
        resumeValid: this.state.resumeValid,
        sampleValid: this.state.sampleValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.photoValid &&
        this.state.lawerHeadlineValid &&
        this.state.aboutLawyerValid &&
        this.state.linkedinValid &&
        this.state.resumeValid &&
        this.state.sampleValid
    });
  }

  render() {
    let routesPath = constant['ROUTES_PATH'];

    return (
      <Role
        step="headline"
        role="seeker"
        profileStatus={this.state.completeStatus}
      >
        <div className="visible-xs mobile-page-heading">
          <span
            className="previous"
            onClick={() => utils.changeUrl(routesPath['SEEKER_EXEPERIENCE'])}
          ></span>{' '}
          Headline + Additional Info{' '}
          <span
            className={
              this.state.completeStatus >= 3 ? 'next' : 'next disabled-element'
            }
            onClick={() => utils.changeUrl(routesPath['SEEKER_JOB_TYPE'])}
          ></span>
        </div>
        <div className="network-form form">
          <div className="network-card card">
            <h4>Headline + Additional Info</h4>
            <div className="upload-photo">
              <div className="form-group">
                <div className="avatar-photo">
                  <AvatarFileUpload handleFileChange={this.handleFileChange} />
                  <img
                    src={this.state.croppedImg}
                    onError={this.profileImgError}
                  />
                </div>
                {this.state.cropperOpen && (
                  <AvatarCropper
                    onRequestHide={this.handleRequestHide}
                    cropperOpen={this.state.cropperOpen}
                    onCrop={this.handleCrop}
                    image={this.state.img}
                    width={200}
                    height={200}
                  />
                )}
              </div>
              <span
                className={this.state.deleteDisabled ? 'd-none' : 'd-block'}
                data-toggle="modal"
                onClick={this.onImageCrossIconClick}
              >
                <img src={constant['IMG_PATH'] + 'svg-images/error.svg'} />
              </span>
              <div
                className={
                  this.state.formErrors.photo !== ''
                    ? 'caption global-error'
                    : 'caption'
                }
              >
                upload photo
                <p>
                  <span>
                    {this.state.formErrors.photo !== ''
                      ? this.state.formErrors.photo
                      : ''}
                  </span>
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="row m-0">
                  <div
                    className={
                      this.state.formErrors.lawyer_headline !== ''
                        ? 'form-group global-error'
                        : 'form-group'
                    }
                  >
                    <label htmlFor="lawyer-head" className="control-label">
                      My Headline
                    </label>
                    <textarea
                      id="lawyer-head"
                      name="lawyer_headline"
                      value={this.state.network.lawyer_headline}
                      onBlur={this.handleInputOnBlur}
                      onChange={this.handleUserInput}
                      className="form-control"
                      placeholder="Please create a brief headline for your Legably profile"
                    ></textarea>
                    <p>
                      <span>
                        {this.state.formErrors.lawyer_headline !== ''
                          ? this.state.formErrors.lawyer_headline
                          : ''}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="row m-0">
                  <div
                    className={
                      this.state.formErrors.linkedin_link !== ''
                        ? 'form-group global-error'
                        : 'form-group'
                    }
                  >
                    <label htmlFor="linkedin-link" className="control-label">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      name="linkedin_link"
                      value={this.state.network.linkedin_link}
                      onBlur={this.handleInputOnBlur}
                      onChange={this.handleUserInput}
                      id="linkedin-link"
                      className="form-control"
                      placeholder="LinkedIn"
                    />
                    <p>
                      <span>
                        {this.state.formErrors.linkedin_link !== ''
                          ? this.state.formErrors.linkedin_link
                          : ''}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div
                  className={
                    this.state.formErrors.about_lawyer !== ''
                      ? 'form-group global-error'
                      : 'form-group'
                  }
                >
                  <label htmlFor="about-lawyer" className="control-label">
                    About Me
                  </label>
                  <textarea
                    id="about-lawyer"
                    name="about_lawyer"
                    value={this.state.network.about_lawyer}
                    onBlur={this.handleInputOnBlur}
                    onChange={this.handleUserInput}
                    className="form-control about-lawyer"
                    placeholder="Please tell us a bit about you, your background and experience, and the types of opportunities you're seeking"
                  ></textarea>
                  <p>
                    <span>
                      {this.state.formErrors.about_lawyer !== ''
                        ? this.state.formErrors.about_lawyer
                        : ''}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              <div
                className={
                  this.state.formErrors.resume !== ''
                    ? 'col-sm-6 upload-document global-error'
                    : 'col-sm-6 upload-document'
                }
              >
                <div className="dropzone">
                  <Dropzone
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onDrop={this.onDropFile}
                    maxSize={this.state.maxSize}
                    multiple={this.state.multiple}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className={
                          this.state.resumeName != ''
                            ? 'm-0 form-group row d-none'
                            : 'm-0 form-group row d-block'
                        }
                      >
                        <input {...getInputProps()} />
                        <span className="d-inline-block">
                          <img
                            src={constant['IMG_PATH'] + 'upload-doc.png'}
                            alt="upload-doc"
                            className="img-responsive pull-right"
                          />
                        </span>
                        <span className="p-5 d-inline-block">
                          <h4>Upload your resume</h4>
                          <p>Drag and Drop or Click to Select</p>
                        </span>
                      </div>
                    )}
                  </Dropzone>
                  <aside
                    className={
                      this.state.resumeName != '' ? 'pt-50 d-block' : 'd-none'
                    }
                  >
                    <ul>
                      <li>
                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                        <span title={this.state.resumeName} className="trunc">
                          {this.state.resumeName}
                        </span>
                        <span onClick={this.deleteResume}>
                          <i className="fa fa-trash-o" aria-hidden="true"></i>
                        </span>
                      </li>
                    </ul>
                  </aside>
                </div>
                <div className="supports pull-right">
                  Supported Format: Pdf, Doc | Size 3 MB
                </div>
                <p className="">
                  <span className="m-0">
                    {this.state.formErrors.resume !== ''
                      ? this.state.formErrors.resume
                      : ''}
                  </span>
                </p>
                <span className="clearfix"></span>
              </div>

              <div
                className={
                  this.state.formErrors.writing_samples !== ''
                    ? 'col-sm-6 upload-document global-error'
                    : 'col-sm-6 upload-document'
                }
              >
                <div className="dropzone">
                  <Dropzone
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onDrop={this.onDrop}
                    maxSize={this.state.maxSize}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className={
                          this.state.alreadyAccepted.length > 0 ||
                          this.state.accepted.length > 0 ||
                          this.state.rejected.length > 0
                            ? 'm-0 form-group row d-none'
                            : 'm-0 form-group row d-block'
                        }
                      >
                        <input {...getInputProps()} />
                        <span className="d-inline-block">
                          <img
                            src={constant['IMG_PATH'] + 'upload-doc.png'}
                            alt="upload-doc"
                            className="img-responsive pull-right"
                          />
                        </span>
                        <span className="p-5 d-inline-block">
                          <h4>Upload writing samples</h4>
                          <p>Drag and Drop or Click to Select</p>
                        </span>
                      </div>
                    )}
                  </Dropzone>
                  <aside
                    className={
                      this.state.alreadyAccepted.length > 0 ||
                      this.state.accepted.length > 0 ||
                      this.state.rejected.length > 0
                        ? 'd-block'
                        : 'd-none'
                    }
                  >
                    <div
                      className={
                        this.state.expand
                          ? 'file-wrapper'
                          : 'file-wrapper max-height-255'
                      }
                    >
                      <ul>
                        {this.state.alreadyAccepted.map((f, index) => (
                          <li key={index}>
                            {' '}
                            <i
                              className="fa fa-file-text-o"
                              aria-hidden="true"
                            ></i>{' '}
                            <span className="trunc" title={f.name}>
                              {f.name}
                            </span>{' '}
                            <span
                              onClick={e =>
                                this.deleteFile('alreadyAccepted', index)
                              }
                            >
                              {' '}
                              <i
                                className="fa fa-trash-o"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <ul>
                        {this.state.accepted.map((f, index) => (
                          <li key={index}>
                            {' '}
                            <i
                              className="fa fa-file-text-o"
                              aria-hidden="true"
                            ></i>{' '}
                            <span className="trunc" title={f.name}>
                              {f.name}
                            </span>{' '}
                            <span
                              onClick={e => this.deleteFile('accepted', index)}
                            >
                              {' '}
                              <i
                                className="fa fa-trash-o"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <ul>
                        {this.state.rejected.map((f, index) => (
                          <li key={index}>
                            {' '}
                            <i
                              className="fa fa-file-text-o"
                              aria-hidden="true"
                            ></i>{' '}
                            <span className="trunc" title={f.name}>
                              {f.name}
                            </span>{' '}
                            <span
                              onClick={e => this.deleteFile('rejected', index)}
                            >
                              {' '}
                              <i
                                className="fa fa-trash-o"
                                aria-hidden="true"
                              ></i>{' '}
                            </span>
                            <p>
                              <span>{f.error}</span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p
                      className={
                        this.state.alreadyAccepted.length +
                          this.state.accepted.length +
                          this.state.rejected.length >
                        1
                          ? 'drag-drop pull-left'
                          : 'drag-drop'
                      }
                    >
                      Drag and Drop or Click to Select
                    </p>
                    <div className="expand-hide-list pull-right">
                      <a
                        className={
                          this.state.expand &&
                          this.state.alreadyAccepted.length +
                            this.state.accepted.length +
                            this.state.rejected.length >
                            1
                            ? 'expand-list'
                            : 'expand-list d-none'
                        }
                        onClick={() => this.expandHide('expand')}
                      >
                        Show More
                      </a>
                      <a
                        className={
                          !this.state.expand &&
                          this.state.alreadyAccepted.length +
                            this.state.accepted.length +
                            this.state.rejected.length >
                            1
                            ? 'hide-list'
                            : 'hide-list d-none'
                        }
                        onClick={() => this.expandHide('hide')}
                      >
                        Show Less
                      </a>
                    </div>
                  </aside>
                </div>

                <p>
                  <span className="d-none m-0">
                    {this.state.formErrors.writing_samples !== ''
                      ? this.state.formErrors.writing_samples
                      : ''}
                  </span>
                </p>
                <div className="supports pull-right">
                  <span className="pull-right">
                    Supported Format: Pdf, Doc | Size 3 MB
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="nxt-prev-btns">
            <button
              type="button"
              onClick={() => utils.changeUrl(routesPath['SEEKER_EXEPERIENCE'])}
              className="previouse-btn btn pull-left"
            >
              {' '}
              Previous{' '}
            </button>
            <div
              className={this.state.editProfile == true ? 'd-block' : 'd-none'}
            >
              <button
                type="button"
                name="save&Next"
                className="nxt-btn btn-primary btn pull-right"
                onClick={this._handleClick}
              >
                {' '}
                Save & Next{' '}
              </button>
              <button
                type="button"
                name="save"
                className="nxt-btn btn-primary btn pull-right mr-1p"
                onClick={this._handleClick}
              >
                {' '}
                Save{' '}
              </button>
              <button
                type="button"
                className="nxt-btn btn-default btn pull-right mr-1p"
                onClick={() => utils.refreshPage()}
              >
                {' '}
                Cancel{' '}
              </button>
            </div>
            <button
              type="submit"
              name="save&Next"
              onClick={this._handleClick}
              className={
                this.state.editProfile == true
                  ? 'd-none nxt-btn btn pull-right'
                  : 'd-block nxt-btn btn-primary btn pull-right'
              }
            >
              {' '}
              Next{' '}
            </button>
            <span className="clear-fix"></span>
          </div>
        </div>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </Role>
    );
  }
}
