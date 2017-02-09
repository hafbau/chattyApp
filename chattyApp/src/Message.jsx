import React, {Component} from 'react';

class Message extends Component {

  constructor(props) {
    super(props);
    this.showMessageByType = this.showMessageByType.bind(this);
    this.stripImageUrl = this.stripImageUrl.bind(this);
  }

  stripImageUrl() {
    const regex = /(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.[^\s]|)$/
    const match = this.props.message.content
                  .match(regex);
    let imgUrl;
    if (match) {
      if (match[5] && (match[2] || match[3])) {
        imgUrl = match[1] ? `${match[1]}//` : 'http://';
        imgUrl += match[2] + match[5];
      }
    }
    const strippedContent = this.props.message.content.replace(regex, '');
    return { imgsrc: imgUrl, content: strippedContent };
  }

  renderByImagePresence(option) {
    if (option.imgsrc) {
      return ( <span className="message-content">
            {option.content}
            <img src={option.imgsrc} alt="image missing" style={{display: 'block', maxWidth: '60%'}} />
          </span> )
    }
    else {
      return (<span className="message-content">
                {this.props.message.content}
              </span>)
    }
  }

  showMessageByType() {
    switch(this.props.message.type) {
      case "incomingMessage":
        // handle incoming message
        return (
          <div className="message">
            <span className="message-username" style={{color: this.props.message.color}}>{this.props.message.username}</span>
            {this.renderByImagePresence(this.stripImageUrl())}
          </div>
        );
      case "incomingNotification":
        // handle incoming notification
        return (
          <div className="message system">
            {this.props.message.oldname} changed their name to {this.props.message.username}.
          </div>
        );
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + this.props.message.type);
    }
  }
  
  render() {
    return this.showMessageByType();
  }
}
export default Message;
