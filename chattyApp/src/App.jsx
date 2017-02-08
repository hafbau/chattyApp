import React, {Component} from 'react';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
    this.getText = this.getText.bind(this);
    this.getUsername = this.getUsername.bind(this);
  }

  componentDidMount() {
    const chatSocket = new WebSocket("ws://localhost:4000");
    chatSocket.onopen = (event) => {
      console.log("Connected to chatty_server");
    }
    this.socket = chatSocket;

    this.socket.onmessage = (event) => {
      console.log(event);
      const newMessage = JSON.parse(event.data);
      const messages = this.state.messages.concat(newMessage);
      this.setState({messages});
    }
  }

  getText(e) {
    if (e.keyCode === 13) {
      const newMessage = {
        username: this.state.currentUser.name,
        content: e.target.value
      };
      
      this.socket.send(JSON.stringify(newMessage));
      e.target.value = "";
    }
  }

  getUsername(e) {
    if (e.keyCode === 13) {
      const currentUser = {
        name: e.target.value
      };
      this.setState({currentUser});
    }
  }

  render() {
    return (<div>
              <h1>Hello Chatty :)</h1>
              <MessageList messages={this.state.messages}/>
              <ChatBar currentUser={this.state.currentUser} getUsername={this.getUsername} onChange={this.getText}/>
            </div>
    );
  }
}
export default App;
