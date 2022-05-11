import React from "react";
import ReactDom from "react-dom";

class AvatarFileUpload extends React.Component {
  constructor () {
    super();

    this.handleFile = this.handleFile.bind(this)
  }

  handleFile(e) {
    var reader = new FileReader();
    var file = e.target.files[0];

    if (!file || !file.name) return;

    if (!(/\.(jpg|jpeg|png)$/i).test(file.name.toLowerCase())) {
      return;
    }

    reader.onload = function(img) {
      ReactDom.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result, file);
    }.bind(this);
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <input ref="in" type="file" accept="image/jpg, image/jpeg, image/png" onChange={this.handleFile} title=" " />
    )
  }
}

export default AvatarFileUpload