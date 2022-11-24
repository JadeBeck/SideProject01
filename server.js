const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when a client connects
io.on('connection', socket => {
    //Three ways to send a messages
    socket.on('joinRoom', ({username, room}) => {
        //Actually create a user
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //Welcome current user
        socket.emit('message', formatMessage('Admin', 'Welcome to ChatCord!'));  //①Only send a message to a single client who connect

        //Broadcast when a user connects
        socket.broadcast
            .to(user.room)  //Emit to a specific room
            .emit('message', formatMessage('Admin', `${user.username} has joined the chat`));  //②Emit messages to everybody expect the user that's connecting

        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage('Admin', `${user.username} has left the chat`));  //③Emit messages to all the clients in general

            //Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});


const port = process.env.PORT || 3005;

server.listen(port, () => console.log(`Server running on port ${port}`));

