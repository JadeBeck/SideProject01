const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connects
io.on('connection', socket => {
    //Three ways to send a messages

    //Welcome current user
    socket.emit('message', 'Welcome to ChatCord!');  //①Only send a message to a single client who connect

    //Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');  //②Emit messages to everybody expect the user that's connecting

    //Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');  //③Emit messages to all the clients in general
    });

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    })
});

const port = process.env.PORT || 3005;

server.listen(port, () => console.log(`Server running on port ${port}`));

