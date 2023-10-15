import { Server } from 'socket.io';

import { CONNECT, DISCONNECT, REQ_FIND_PAIR } from '../constants/socket';

import handleDisconnect from './handleDisconnect';
import handleFindPair from './handleFindPair';

const setUpIo = (io: Server): void => {
  io.on(CONNECT, (socket) => {
    console.log(socket.id, ' IO connected');
    socket.on(REQ_FIND_PAIR, handleFindPair(socket, io));
    socket.on(DISCONNECT, handleDisconnect(socket));
  });
  console.log('IO has been set up.');
};

export default setUpIo;
