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


// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
let clientCount = 0;
wss.on('connection', (ws) => {
  console.log(++clientCount, 'client(s) connected');

  // on message
  ws.on('message', (message) => {
    mssgObj = JSON.parse(message);

    // setting the message id to a random uuid
    mssgObj.id = uuid.v4();

    // broadcast to all connected
    wss.broadcast(JSON.stringify(mssgObj));
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log(`A client disconnected, remaining ${--clientCount} client(s)`);
  });
});