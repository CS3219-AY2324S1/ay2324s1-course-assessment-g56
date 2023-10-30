import { Server, Socket } from 'socket.io';
import MatchingQueue from 'structs/MatchingQueue';
import SidToUidMap from 'structs/SidToUidMap';
import UidCallbackMap from 'structs/UidToCallbackMap';

import { RES_STOP_FINDING_PAIR } from 'constants/socket';

type StopFindingPairFunction = () => Promise<void>;

const handleStopFindingPair =
  (socket: Socket, _io: Server): StopFindingPairFunction =>
  async (): Promise<void> => {
    console.log('Socket', socket.id, 'wants to stop finding pair.');
    const user = SidToUidMap.retrieveUser(socket.id);
    const uid = SidToUidMap.retrieveUid(socket.id);
    if (uid) {
      UidCallbackMap.stopAndRemove(uid);
    }
    if (user == null) {
      socket.emit(RES_STOP_FINDING_PAIR);
      return;
    }
    MatchingQueue.remove(user);
    console.log('User', user.uid, 'removed from queue.');
    socket.emit(RES_STOP_FINDING_PAIR);
  };

export default handleStopFindingPair;
