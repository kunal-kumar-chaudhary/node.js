const http = require('http');
const express = require('express');
const os = require("os")
const path = require('path');
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

// ---------------------------------------------------------
// socket.io handlers for handling our socket connections
// io will handle our socket connections
const io = new Server(server);

io.on("connection", (socket) =>{
    // socket is the client that is connecting to our server
    // clients are called sockets in the world of socket.io
    console.log("A new client has connected", socket.id); 
    // here we will handle the message coming from client side
    socket.on("user-message", (message)=>{
        // now we need to send this message to every connection
        io.emit("message", message);
    });
});



// ---------------------------------------------------------
// express handlers for handling our http requests

app.use(express.static(path.resolve("./public")));
// this returns the current global directory
console.log(__dirname)
app.get('/kunal', (req, res) => {
   return res.sendFile(path.join(__dirname, "public", "index.html"));
});
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});