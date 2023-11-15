import { Socket } from 'socket.io';
import SidToUidMap from 'structs/SidToUidMap';

const mockAuthMiddleware = (socket: Socket, next: () => void): void => {
  SidToUidMap.insertUid(socket.id, socket.id);
  // Join the room
  socket.join(socket.id);
  next();
};

export default mockAuthMiddleware;
