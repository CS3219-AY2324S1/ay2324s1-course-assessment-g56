"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../constants/socket");
const setUpIo = (io) => {
    io.on(socket_1.CONNECT, (socket) => {
        console.log('IO connected');
        socket.on('custom', (msg) => {
            // Broadcast the message to all connected clients
            console.log("MESSAGE RECEIVED", msg);
            io.emit('custom', msg);
        });
    });
    console.log('IO has been set up.');
};
exports.default = setUpIo;
