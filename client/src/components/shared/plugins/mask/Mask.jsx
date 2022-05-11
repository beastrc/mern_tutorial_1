import React from 'react';
import ReactDOM from 'react-dom'

export default class Mask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.dataValue || '',
      name: this.props.nameValue || 'mask_input',
      placeholder: this.props.placeholderValue || '',
      mask: this.props.mask
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(e) {
    let val = e.target.value;
    this.setState({value: val});
    this.props.onMaskChange(e, val);
  }

  handleBlur(e) {
    this.props.onMaskBlur(e);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mask !== this.props.mask) {
      this.setState({
        mask: nextProps.mask
      }, function() {
        this.setMask();
      });
    }

    this.setState({
      value: nextProps.dataValue || '',
      name: nextProps.nameValue || 'mask_input',
      placeholder: nextProps.placeholderValue || ''
    });
  }

  componentDidMount() {
    this.setMask();
  }

  setMask() {
    var $elem = $(ReactDOM.findDOMNode(this.refs.maskedInput));
    var reverse = {reverse: false};

    if (this.props.isReverse) {
      reverse = {reverse: true};
    }

    $elem.mask(this.state.mask, reverse);
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.value} name={this.state.name} className="form-control" onBlur={this.handleBlur} placeholder={this.state.placeholder} onChange={this.handleChange} ref="maskedInput"></input>
      </div>
    );
  }
}
