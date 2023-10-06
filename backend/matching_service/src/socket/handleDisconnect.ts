import { Server, Socket } from 'socket.io';
import { User } from '../constants/user';
import { Difficulty } from '../constants/difficulty';

import MatchingQueue from '../logic/MatchingQueue';

type DisconnectFunction = () => Promise<void>;

export const handleDisconnect = (
  socket: Socket,
  _io: Server,
): DisconnectFunction => {
  return async (): Promise<void> => {
    console.log('Socket', socket.id, 'is disconnecting.');

    const disconnectedUser: User = {
        sid: socket.id,
        difficulty: Difficulty.UNKNOWN
    };

    MatchingQueue.remove(disconnectedUser)
    console.log('User', disconnectedUser.sid, 'removed from queue.');
 
    socket.leave(disconnectedUser.sid);
    console.log('Socket', socket.id, 'has disconnected.');
  };
};
