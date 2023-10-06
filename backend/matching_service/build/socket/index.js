"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../constants/socket");
const handleFindPair_1 = require("./handleFindPair");
const handleDisconnect_1 = require("./handleDisconnect");
const setUpIo = (io) => {
    io.on(socket_1.CONNECT, (socket) => {
        console.log('IO connected');
        socket.on(socket_1.REQ_FIND_PAIR, (0, handleFindPair_1.handleFindPair)(socket, io));
        socket.on(socket_1.DISCONNECT, (0, handleDisconnect_1.handleDisconnect)(socket, io));
    });
    console.log('IO has been set up.');
};
exports.default = setUpIo;
