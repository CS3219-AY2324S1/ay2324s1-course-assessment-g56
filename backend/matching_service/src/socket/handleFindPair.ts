import { Server, Socket } from 'socket.io';

import {
  DISCONNECT,
  ERROR_FIND_PAIR,
  RES_CANNOT_FIND_PAIR,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from '../constants/socket';
import MatchingQueue from '../structs/MatchingQueue';
import UidToCallbackMap from '../structs/UidToCallbackMap';
import { QuestionComplexity } from '../types/question';
import { User } from '../types/user';

type FindPairFunction = (
  lowerBoundDifficulty: QuestionComplexity,
  upperBoundDifficulty: QuestionComplexity,
) => Promise<void>;
const TIMEOUT_DURATION = 30000;

const handleFindPair =
  (socket: Socket, io: Server): FindPairFunction =>
  async (
    lowerBoundDifficulty: QuestionComplexity,
    upperBoundDifficulty: QuestionComplexity,
  ): Promise<void> => {
    const newUser: User = {
      sid: socket.id,
      lowerBoundDifficulty,
      upperBoundDifficulty,
    };

    console.log(
      'Socket',
      newUser.sid,
      'finding pair for',
      lowerBoundDifficulty,
      'to',
      upperBoundDifficulty,
    );

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
        console.log(`Could not find pair in time ${newUser.sid}`);
        // Leave the queue
        MatchingQueue.remove(newUser);
        UidToCallbackMap.remove(newUser.sid);
        socket.emit(RES_CANNOT_FIND_PAIR);
      }, TIMEOUT_DURATION);
      UidToCallbackMap.insert(newUser.sid, timeout);
      return;
    }

    socket.on(DISCONNECT, () => {});

    // We found a match!
    const [user1, user2] = result;
    console.log(`Match found: ${user1.sid}, ${user2.sid}`);

    io.to(user1.sid).emit(RES_FOUND_PAIR, {
      roomId: 'test',
    });
    io.to(user2.sid).emit(RES_FOUND_PAIR, {
      roomId: 'test',
    });

    MatchingQueue.remove(user1);
    MatchingQueue.remove(user2);
    UidToCallbackMap.stopAndRemove(user1.sid);
    UidToCallbackMap.stopAndRemove(user2.sid);
    console.log('Match found, timeouts cleared, room created.');
  };
export default handleFindPair;
