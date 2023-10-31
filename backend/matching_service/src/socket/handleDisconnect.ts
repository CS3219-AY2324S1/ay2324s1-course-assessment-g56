import { Server, Socket } from 'socket.io';
import MatchingQueue from 'structs/MatchingQueue';
import SidToUidMap from 'structs/SidToUidMap';
import UidToCallbackMap from 'structs/UidToCallbackMap';

type DisconnectFunction = () => Promise<void>;

const handleDisconnect =
  (socket: Socket, _io: Server): DisconnectFunction =>
  async (): Promise<void> => {
    console.log('Socket', socket.id, 'is disconnecting.');

    const [uid, user] = SidToUidMap.remove(socket.id);

    if (user) {
      MatchingQueue.remove(user);
      console.log('User', uid, 'removed from queue.');
    }

    UidToCallbackMap.stopAndRemove(uid);
    socket.leave(uid);
    console.log('Socket', socket.id, 'has disconnected.');
  };
export default handleDisconnect;
