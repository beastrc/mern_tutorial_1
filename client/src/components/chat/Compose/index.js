import React, { Component } from 'react';


class Compose extends Component {
  // static propTypes = {
  //     className: PropTypes.string,
  // };

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }
  }

  componentDidMount() {    
    
  }
  // send the chat message through socket
  sendMessage(event) {
    event.persist()

    // if the ENTER key is pressed emit the message
    if ((event.keyCode == 13 || event.which == 13) && !event.ctrlKey) {
      //let message = this.state.message.replace(this.state.message.charAt(this.state.message.length - 1), "");
      let message = this.state.message;

      // emit the message
      if (message.length > 0) {
        //this.socket.emit('message', data)
        let { onNewMessageArrival } = this.props
        onNewMessageArrival(message)
      }
      
      // reset the input text value 
      this.setState({
        message: ''
      })

    } else if ((event.keyCode == 13 || event.which == 13) && event.ctrlKey) {
      alert("control enter");
      console.log('CTRL pressed')
      this.setState({
        message: event.target.value + "\n"
      })
    }
  }

  handleChange(event) {
    event.persist()

    this.setState({
      message: event.target.value
    })
  }

  render() {

    return (
      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
          // disabled={this.props.isDisabled}
          onChange={this.handleChange.bind(this)}
          onKeyPress={this.sendMessage.bind(this)}
          value={this.state.message} />
        {
          this.props.rightItems
        }
      </div>
    );
  }
}

export default Compose;



  // return (
  //   <div className="compose">
  //     <input
  //       type="text"
  //       className="compose-input"
  //       placeholder="Type a message, @name"
  //     />

  //     {
  //       props.rightItems
  //     }
  //   </div>
  // );