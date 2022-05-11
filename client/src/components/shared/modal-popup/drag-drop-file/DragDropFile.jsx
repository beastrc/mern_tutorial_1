import React from 'react';
import Dropzone from 'react-dropzone';

import { constant } from '../../../../shared/index';

export default class DragDropFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: '',
      validFormats: `application/msword,
        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
        application/vnd.openxmlformats-officedocument.wordprocessingml.template,
        application/vnd.ms-word.document.macroEnabled.12,
        application/vnd.ms-word.template.macroEnabled.12,
        application/vnd.ms-powerpoint,
        application/vnd.openxmlformats-officedocument.presentationml.presentation,
        application/vnd.openxmlformats-officedocument.presentationml.template,
        application/vnd.openxmlformats-officedocument.presentationml.slideshow,
        application/vnd.ms-powerpoint.addin.macroEnabled.12,
        application/vnd.ms-powerpoint.presentation.macroEnabled.12,
        application/vnd.ms-powerpoint.template.macroEnabled.12,
        application/vnd.ms-powerpoint.slideshow.macroEnabled.12,
        application/vnd.ms-excel,
        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
        application/vnd.openxmlformats-officedocument.spreadsheetml.template,
        application/vnd.ms-excel.sheet.macroEnabled.12,
        application/vnd.ms-excel.template.macroEnabled.12,
        application/vnd.ms-excel.addin.macroEnabled.12,
        application/vnd.ms-excel.sheet.binary.macroEnabled.12,
        application/pdf,
        application/zip, application/x-zip-compressed,
        application/octet-stream,
        .doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.pdf`
    }
    this.onDropFile = this.onDropFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  getValidFormats() {
    return ['msword',
      'vnd.openxmlformats-officedocument.wordprocessingml.document',
      'vnd.openxmlformats-officedocument.wordprocessingml.template',
      'vnd.ms-word.document.macroEnabled.12',
      'vnd.ms-word.template.macroEnabled.12',
      'vnd.ms-powerpoint',
      'vnd.openxmlformats-officedocument.presentationml.presentation',
      'vnd.openxmlformats-officedocument.presentationml.template',
      'vnd.openxmlformats-officedocument.presentationml.slideshow',
      'vnd.ms-powerpoint.addin.macroEnabled.12',
      'vnd.ms-powerpoint.presentation.macroEnabled.12',
      'vnd.ms-powerpoint.template.macroEnabled.12',
      'vnd.ms-powerpoint.slideshow.macroEnabled.12',
      'vnd.ms-excel',
      'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'vnd.openxmlformats-officedocument.spreadsheetml.template',
      'vnd.ms-excel.sheet.macroEnabled.12',
      'vnd.ms-excel.template.macroEnabled.12',
      'vnd.ms-excel.addin.macroEnabled.12',
      'vnd.ms-excel.sheet.binary.macroEnabled.12', 'x-zip-compressed',
      'pdf', 'ppt', 'zip', 'xlsx', 'xls','doc','docx','octet-stream','pptx'];
  }

  getFileTypeOrExt(file) {
    let fileType = file.type;
    if (!fileType) {
      let fileNameArr = file.name.split('.');
      fileType = fileNameArr[fileNameArr.length-1];
    }
    return fileType;
  }

  onDropFile(accepted, rejected, evt) {
    let _this = this;
    if (accepted.length) {
      let uploadedFile = accepted[0];
      let fileName = uploadedFile.name;
      let fileObj = {
        name: fileName,
        size: uploadedFile.size,
        type: _this.getFileTypeOrExt(uploadedFile)
      }
      let fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedFile);
      fileReader.onload = function(event) {
        fileObj['dataUrl'] = event.target.result; /*add dataUrl to file properties*/
        _this.props.handler(null, fileObj);
      }
      _this.setState({filename: fileName});
    } else if(rejected.length) {
      let errObj = {
        'type': 'format',
        'msg': constant['INVALID_FILE_FORMAT']
      };
      let filetype = _this.getFileTypeOrExt(rejected[0]);
      let ext = filetype.substr(filetype.lastIndexOf('/') + 1);
      if(rejected[0].size > constant['MAX_UPLOAD_FILE_SIZE']) {
        errObj = {
          'type': 'size',
          'msg': constant['FILE_SIZE_ERROR']
        }
      }
      _this.setState({filename: rejected[0].name});
      _this.props.handler([errObj], null);
    }
  }

  deleteFile() {
    this.setState({filename: ''});
    this.props.handler(null, {});
  }

  render() {
    return (
      <div>
        <div className="dropzone mt-20">
          <Dropzone accept={this.state.validFormats} maxSize={constant['MAX_UPLOAD_FILE_SIZE']} multiple={false} onDrop={this.onDropFile.bind(this)}>
            {({getRootProps, getInputProps, rejectedFiles}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className={(this.state.filename === '') ? "cover" : "d-none"}>
                    <span className="d-inline-block mr-20">
                      <img src={constant['IMG_PATH'] + 'upload-file.png'} alt="upload-file" className="d-inline-block" />
                    </span>
                    <span className="d-inline-block v-middle col-xs-9 p-0">
                      <h4>
                        { this.props.title ?
                            this.props.title
                          :
                            'Drag and Drop or Click to Select'
                        }
                      </h4>
                      {this.props.desc ?
                        <div>
                          {this.props.desc.split("'break'").map((i,key) => {
                            return <h5 key={key}>{i}</h5>;
                          })}
                        </div>
                        :
                        <h5>Upload your file (use zip compression for multiple files)</h5>
                      }
                    </span>
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
          <aside className={(this.state.filename != '') ? "pt-50 d-block" : "d-none"}>
              <ul>
                <li>
                  <i className="fa fa-file-text-o" aria-hidden="true"></i>
                  <span title={this.state.filename} className="trunc">{this.state.filename}</span>
                  <span onClick={this.deleteFile.bind(this)}>
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                  </span>
                </li>
              </ul>
          </aside>
        </div>
        <div className="pull-right mt-10">
          <p className="para">Supported Format : PDF, Word, Excel, PPT, Zip.</p>
        </div>
      </div>
    );
  }
}
