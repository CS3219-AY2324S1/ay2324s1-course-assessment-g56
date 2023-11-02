import mockMiddleWare from 'mockComponents/mockAuthMiddleware';
import { Server } from 'socket.io';

import {
  CONNECT,
  DISCONNECT,
  REQ_FIND_PAIR,
  REQ_STOP_FINDING_PAIR,
} from 'constants/socket';

import authMiddleware from './authMiddleware';
import handleDisconnect from './handleDisconnect';
import handleFindPair from './handleFindPair';
import handleStopFindingPair from './handleStopFindingPair';

const setUpIo = (io: Server): void => {
  if (process.env.NODE_ENV !== 'test') {
    io.use(authMiddleware);
  } else {
    io.use(mockMiddleWare);
  }

  io.on(CONNECT, (socket) => {
    console.log(socket.id, ' IO connected');
    socket.on(REQ_FIND_PAIR, handleFindPair(socket, io));
    socket.on(DISCONNECT, handleDisconnect(socket, io));
    socket.on(REQ_STOP_FINDING_PAIR, handleStopFindingPair(socket, io));
  });
  console.log('IO has been set up.');
};

export default setUpIo;
