
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const createServer = http.createServer;
const DEFAULT_PORT = 5000;
const path = require('path');
class Server {
    constructor() {
        this.initialize();

        this.handleRoutes();
        this.handleSocketConnection();
    }

    initialize() {
        this.activeSockets = [];
        this.socketNames = {};
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = socketIO(this.httpServer);
        this.configureApp()
    }
    configureApp() {
        this.app.use(express.static(path.join(__dirname, "./dist")));
    }
    handleRoutes() {
        this.app.get("/", (req, res) => {
            res.send(`<h1>Hello World</h1>`);
        });
    }

    handleSocketConnection() {
        this.io.on("connection", socket => {
            console.log('Connection comming');
            const existingSocket = this.activeSockets.find(
                existingSocket => existingSocket === socket.id
            );

            if (!existingSocket) {
                this.activeSockets.push(socket.id);
                this.socketNames[socket.id] = 'User_' + Date.now()

                socket.emit("update-user-list", {
                    users: this.socketNames
                });
                socket.broadcast.emit('update-user-list', {
                    users: this.socketNames
                })
            }
            socket.on('update-name', (name) => {
                console.log(name);
                this.socketNames[socket.id] = name;
                socket.emit("update-user-list", {
                    users: this.socketNames
                });
                socket.broadcast.emit('update-user-list', {
                    users: this.socketNames
                })
            })
            socket.on('call-user', (payload) => {
                console.log('Call user');
                console.log(socket.id);
                console.log(payload);
                socket.to(payload.targetId).emit('call-made', {
                    offer: payload.offer,
                    targetId: socket.id
                });
            });
            socket.on('make-answer', (payload) => {
                console.log('Make answer');
                console.log(payload);
                setTimeout(() => {
                    socket.to(payload.targetId).emit('answer-made', {
                        targetId: socket.id,
                        answer: payload.answer
                    })
                }, 1000);
            })
            socket.on("disconnect", () => {
                console.log('Disconnect');
                this.activeSockets = this.activeSockets.filter(
                    existingSocket => existingSocket !== socket.id
                );
                delete this.socketNames[socket.id];
                socket.broadcast.emit("remove-user", {
                    socketId: socket.id
                });
            });
        });
    }

    listen(callback) {
        this.httpServer.listen( DEFAULT_PORT, () =>
            callback(DEFAULT_PORT)
        );
    }
}

const server = new Server();
server.listen(port => {
    console.log(`Server is listening on http://localhost:${port}`);
});
