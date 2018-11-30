let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets');
}
const {routerLoggedOut} = require('./router-logged-out');
const {routerLoggedIn} = require('./router-logged-in');
const db = require('./db.js');

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: process.env.APP_URL || 'localhost:8080' });

const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieSessionMiddleware = cookieSession({
    secret: secrets.secretString,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
const compression = require('compression');
const csurf = require('csurf');

app.use(bodyParser.json());
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(compression());
if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
app.use(csurf());
app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

let onlineUsers = [];

io.on('connection', function(socket) {

    socket.emit('userId', socket.request.session.user.id);

    socket.on('chatMessage', function(message) {
        db.insertChatMessage(socket.request.session.user.id, message)
            .then(() => {
                let chatMessage = {
                    id: socket.request.session.user.id,
                    firstname: socket.request.session.user.firstname,
                    lastname: socket.request.session.user.lastname,
                    email: socket.request.session.user.email,
                    avatar_url: socket.request.session.user.avatar_url,
                    bio: socket.request.session.user.bio,
                    message: message,
                    created_at: new Date()
                };
                io.sockets.emit('chatMessage', chatMessage);
            });
    });

    db.getChatMessages()
        .then(chatMessages => {
            socket.emit('chatMessages', [...chatMessages.rows].reverse());
        }
        );

    socket.on('privateChatMessage', function(message) {
        db.insertPrivateChatMessage(socket.request.session.user.id, message.otherUserId, message.value)
            .then(() => {
                let privateChatMessage = {
                    id: socket.request.session.user.id,
                    firstname: socket.request.session.user.firstname,
                    lastname: socket.request.session.user.lastname,
                    avatar_url: socket.request.session.user.avatar_url,
                    receiver_id: message.otherUserId,
                    message: message.value,
                    created_at: new Date()
                };
                io.sockets.emit('privateChatMessage', privateChatMessage);
            });
    });

    db.getPrivateChatMessages(socket.request.session.user.id)
        .then(privateChatMessages => {
            socket.emit('privateChatMessages', [...privateChatMessages.rows].reverse());
        }
        );

    if (!socket.request.session || !socket.request.session.user) {
        return socket.disconnect(true);
    }

    let alreadyThere = false;
    if (onlineUsers.length > 0) {
        for (var val of onlineUsers) {
            if (val.user.id == socket.request.session.user.id) {
                alreadyThere = true;
                val.socketId.push(socket.id);
            }
        }
    }
    if (!alreadyThere) {
        onlineUsers.push(
            {
                user: socket.request.session.user,
                socketId: [socket.id]
            }
        );
        socket.broadcast.emit('userJoined', socket.request.session.user);
    }

    let onlineUsersFiltered = onlineUsers =>
        onlineUsers.filter(user =>
            user.user.id != socket.request.session.user.id)
            .map(user => user.user);
    socket.emit('onlineUsers', onlineUsersFiltered(onlineUsers));

    socket.on('disconnect', function() {
        (function removeSocketId(array = onlineUsers, jndex){
            for (let [index, val] of array.entries()) {
                if (val.socketId && val.socketId.length > 1) {
                    removeSocketId(val.socketId, index);
                } else if (val.socketId && val.socketId.length == 1 && val.socketId[0] == socket.id) {
                    onlineUsers.splice(index, 1);
                    io.sockets.emit('userLeft', socket.request.session.user.id);
                } else if (val == socket.id) {
                    onlineUsers[jndex].socketId.splice(index, 1);
                }
            }
        })();
    });
});

app.use(express.static('./public'));
app.use(routerLoggedOut);
app.use(routerLoggedIn);

server.listen(process.env.PORT || 8080, () => console.log('listening on port 8080'));
