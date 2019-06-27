var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
//create variable for keeping track of all logged in users
let lobbyUsers = [];
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });

    socket.on('join', function (user) {
        console.log('we receive user from frontend as: ' + user) 
        lobbyUsers = lobbyUsers.filter(Boolean);
        if(lobbyUsers.includes(user)) return;
        lobbyUsers.push(user)
        io.emit('join', lobbyUsers);
        console.log('users: ' + lobbyUsers);
    });

    socket.on('logout', function(user){
        let filtered = lobbyUsers.filter((value, index, arr) => {
            return value !== user;  
        });
        lobbyUsers = filtered;
        console.log(user + ' loggedout');
      });
});

http.listen(3002, function () {
    console.log('listening on *:3002');
});