import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    }
  }

  componentDidMount() {
    const chatSocket = new WebSocket("ws://localhost:4000");
    chatSocket.onopen = (event) => {
      console.log("Connected to chatty_server");
    }
    this.socket = chatSocket;

    this.socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      if (!newMessage.type) {
        this.setState({usersCount: newMessage.count});
        if (!this.state.color) this.setState({color: newMessage.color});
      } else {
        const messages = this.state.messages.concat(newMessage);
        this.setState({messages});
      }
    }
  }

  getText(e) {
    if (e.keyCode === 13) {
      const newMessage = {
        username: this.state.currentUser.name,
        content: e.target.value
      };
      newMessage.type = 'postMessage';
      newMessage.color = this.state.color;
      this.socket.send(JSON.stringify(newMessage));
      e.target.value = "";
    }
  }

  getUsername(e) {
    if (e.keyCode === 13) {
      const currentUser = {
        name: e.target.value
      };
      const sysMessage = {
        type: 'postNotification',
        oldname: this.state.currentUser.name,
        username: currentUser.name
      };
      this.setState({currentUser});
      this.socket.send(JSON.stringify(sysMessage));
    }
  }

  render() {
    return (<div>
              <span className="nav-status">{this.state.usersCount} user(s) online</span>
              <MessageList messages={this.state.messages} color={this.state.color}/>
              <ChatBar currentUser={this.state.currentUser} getUsername={(e) => {this.getUsername(e)}} onChange={(e) => {this.getText(e)}}/>
            </div>
    );
  }
}
export default App;
