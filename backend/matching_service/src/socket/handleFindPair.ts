import { Server, Socket } from 'socket.io';
import { User } from '../constants/user';
import { Difficulty } from '../constants/difficulty';

import {
  ERROR_FIND_PAIR,
  RES_CANNOT_FIND_PAIR,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from '../constants/socket';
import MatchingQueue from '../logic/MatchingQueue';

type FindPairFunction = (difficulty: Difficulty) => Promise<void>;
const TIMEOUT_DURATION = 30000;

export const handleFindPair = (
  socket: Socket,
  io: Server,
): FindPairFunction => {
  return async (difficulty: Difficulty): Promise<void> => {
    const newUser: User = {
        sid: socket.id,
        difficulty: difficulty
    };

    console.log('Socket', newUser.sid, 'finding pair for', difficulty);

    socket.join(newUser.sid);

    if (MatchingQueue.isInQueue(newUser.sid)) {
      console.log('User already in queue.');
      socket.emit(
        ERROR_FIND_PAIR,
        "You're already in the queue! Check your other tabs and windows!",
      );
      return;
    }

    let result;
    try {
      result = MatchingQueue.enqueue(newUser);
    } catch {
      socket.emit(
        ERROR_FIND_PAIR,
        'Something went wrong! Please refresh and try again.',
      );
      return;
    }

    // Let the frontend know we're looking for a pair now.
    socket.emit(RES_FIND_PAIR);

    // No match
    if (result == null) {
      console.log('No current match found, setting timeout.');
      const timeout = setTimeout(() => {
        console.log("Could not find pair in time", newUser.sid);
        // Leave the queue
        MatchingQueue.remove(newUser);
        socket.emit(RES_CANNOT_FIND_PAIR);
      }, TIMEOUT_DURATION);
      return;
    }

    // We found a match!
    const [user1, user2] = result;
    console.log('Match found:', user1.sid, user2.sid);

    io.to(user1.sid).emit(RES_FOUND_PAIR, {
      roomId: "test"
    });
    io.to(user2.sid).emit(RES_FOUND_PAIR, {
        roomId: "test"
    });

    MatchingQueue.remove(user1);
    MatchingQueue.remove(user2);
    console.log('Match found, timeouts cleared, room created.');
  };
};