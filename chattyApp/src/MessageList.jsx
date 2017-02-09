import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.propMessage = this.propMessage.bind(this);
  }

  propMessage(m) {
    return (<Message key={m.id} message={m}/>);
  }

  render() {
    return (
      <main className="messages">
        {this.props.messages.map(this.propMessage)}
    </main>
      
    );
  }
}
export default MessageList;
