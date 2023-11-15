import { createClient } from '@supabase/supabase-js';
import { createMockRoom } from 'mockComponents/mockApi';
import { Server, Socket } from 'socket.io';
import MatchingQueue from 'structs/MatchingQueue';
import SidToUidMap from 'structs/SidToUidMap';
import UidToCallbackMap from 'structs/UidToCallbackMap';

import {
  DISCONNECT,
  ERROR_FIND_PAIR,
  RES_CANNOT_FIND_PAIR,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from 'constants/socket';
import { QuestionDifficulty } from 'types/question';
import { User } from 'types/user';
import { createRoom } from 'utils/api';

type FindPairFunction = (
  lowerBoundDifficulty: QuestionDifficulty,
  upperBoundDifficulty: QuestionDifficulty,
) => Promise<void>;
const TIMEOUT_DURATION = 30000;

const supabase = createClient(
  `https://${process.env.SUPABASE_URL}` || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

const handleFindPair =
  (socket: Socket, io: Server): FindPairFunction =>
  async (
    lowerBoundDifficulty: QuestionDifficulty,
    upperBoundDifficulty: QuestionDifficulty,
  ): Promise<void> => {
    console.log(
      `Socket ${socket.id} finding pair for ${lowerBoundDifficulty} to ${upperBoundDifficulty}`,
    );

    const uid = SidToUidMap.retrieveUid(socket.id);
    if (uid == null) {
      console.log('Unauthorized, cannot find uid.');
      socket.emit(ERROR_FIND_PAIR, 'Unauthorized. Please log in.');
      return;
    }

    if (MatchingQueue.isInQueue(uid)) {
      console.log('User already in queue.');
      socket.emit(
        ERROR_FIND_PAIR,
        "You're already in the queue! Check your other tabs and windows!",
      );
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', uid)
      .single();

    const newUser: User = {
      uid,
      sid: socket.id,
      username: data?.username,
      avatarUrl: data?.avatar_url,
      lowerBoundDifficulty,
      upperBoundDifficulty,
    };
    SidToUidMap.insertUser(socket.id, newUser);

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
        console.log(`Could not find pair in time ${uid}`);
        // Leave the queue
        MatchingQueue.remove(newUser);
        UidToCallbackMap.remove(uid);
        socket.emit(RES_CANNOT_FIND_PAIR);
      }, TIMEOUT_DURATION);
      UidToCallbackMap.insert(uid, timeout);
      return;
    }

    socket.on(DISCONNECT, () => {});

    // We found a match!
    const [difficulty, user1, user2] = result;

    let roomId;
    if (process.env.NODE_ENV === 'test') {
      roomId = (await createMockRoom(user1.uid, user2.uid, difficulty)).room_id;
    } else {
      roomId = (await createRoom(user1.uid, user2.uid, difficulty)).room_id;
    }

    console.log(
      'Match found at',
      difficulty,
      'difficulty:',
      user1.uid,
      user2.uid,
    );

    MatchingQueue.remove(user1);
    MatchingQueue.remove(user2);
    UidToCallbackMap.stopAndRemove(user1.uid);
    UidToCallbackMap.stopAndRemove(user2.uid);

    io.to(user1.uid).emit(RES_FOUND_PAIR, {
      roomId,
      matchedUser: {
        username: user2.username,
        avatarUrl: user2.avatarUrl,
      },
      difficulty,
    });
    io.to(user2.uid).emit(RES_FOUND_PAIR, {
      roomId,
      matchedUser: {
        username: user1.username,
        avatarUrl: user1.avatarUrl,
      },
      difficulty,
    });
    console.log('Match found, timeouts cleared, room created.');
  };
export default handleFindPair;
