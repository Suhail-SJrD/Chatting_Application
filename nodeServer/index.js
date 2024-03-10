// Node Server which will handle socket io connection's
var express = require("express");
var app = express();
var http = require("http").createServer(app);
const io = require('socket.io') (http,{
    cors:{
        origin:"*"
    }
});

http.listen(8000,function (){
    console.log("Server Started...");
    io.on("connection", function(socket){
        console.log("user connected "+ socket.id);
    });
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {

        console.log("New User", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    socket.on('disconnect',message =>{
        socket.broadcast.emit('left',users[socket.id])
        delete users[socket.id];
    })

})