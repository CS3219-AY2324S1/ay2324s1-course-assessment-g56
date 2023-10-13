import { Socket } from 'socket.io';

import MatchingQueue from '../structs/MatchingQueue';
import { QuestionComplexity } from '../types/question';
import { User } from '../types/user';

type DisconnectFunction = () => Promise<void>;

const handleDisconnect =
  (socket: Socket): DisconnectFunction =>
  async (): Promise<void> => {
    console.log('Socket', socket.id, 'is disconnecting.');

    const disconnectedUser: User = {
      sid: socket.id,
      lowerBoundDifficulty: QuestionComplexity.EASY,
      upperBoundDifficulty: QuestionComplexity.HARD,
    };

    MatchingQueue.remove(disconnectedUser);
    console.log('User', disconnectedUser.sid, 'removed from queue.');

    socket.leave(disconnectedUser.sid);
    console.log('Socket', socket.id, 'has disconnected.');
  };
export default handleDisconnect;
