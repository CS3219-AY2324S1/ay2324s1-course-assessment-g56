import { Server } from 'socket.io';

import {
  CONNECT,
  DISCONNECT,
  REQ_FIND_PAIR,
} from '../constants/socket';

import { handleFindPair } from './handleFindPair';
import { handleDisconnect } from './handleDisconnect';

const setUpIo = (io: Server): void => {
  io.on(CONNECT, (socket) => {
    console.log('IO connected');
    socket.on(REQ_FIND_PAIR, handleFindPair(socket, io));
    socket.on(DISCONNECT, handleDisconnect(socket, io));
  });
  console.log('IO has been set up.');
};

export default setUpIo;
