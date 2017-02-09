// server.js

const express = require('express');
const WebSocket = require('ws')
const SocketServer = WebSocket.Server;
const uuid = require('node-uuid');

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// setting up broadcast function to all.
wss.broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const getImageUrls = function(string) {
  string.includes(/^http*.gif$/)
}

const colors = ['#ff0000', '#00ff00', '#0000ff', 'tomato'];

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  let count = wss.clients.size;
  console.log(count, 'client(s) connected');
  
  const setupMessage = {
    count: count,
    color: colors[Math.floor(Math.random() * 4)]
  }
  wss.broadcast(JSON.stringify(setupMessage));



  // on message
  ws.on('message', (message) => {
    mssgObj = JSON.parse(message);

    // setting the message id to a random uuid
    mssgObj.id = uuid.v4();

    //set message type before broadcasting
    switch(mssgObj.type) {
      case "postMessage":
        mssgObj.type = "incomingMessage";
        break;
      case "postNotification":
        mssgObj.type = "incomingNotification"
        break;
      default:
        console.log("Unknown event type " + mssgObj.type);
    }

    // broadcast to all connected
    wss.broadcast(JSON.stringify(mssgObj));
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log(`Client disconnected, remaining ${wss.clients.size} client(s)`);
    wss.broadcast(`${wss.clients.size}`);
  })
});