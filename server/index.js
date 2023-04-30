const express = require('express');
const app = express();
const PORT = 4000;

//imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

let users = [];
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    
    socket.on('message', (data) => {
        // console.log(data);
        socketIO.emit('messageResponse', data);
    });
    

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));


    socket.on('newUser', (data) => {
        //update user array. 
        users.push(data);

        //send users to clients
        socketIO.emit('newUserResponse', users);
    });
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        //remove user with disconnected socket id from array. 
        users = users.filter((user) => user.socketID !== socket.id);

        //send new user array to clients
        socketIO.emit('newUserResponse', users);
      });
      
      
});


//GET 
app.get('/api', (req, res) => {
    res.json({
        message: "hello world",
    });
});

http.listen(PORT, ()=>{
    console.log(`Server listening on ${PORT}`);
});