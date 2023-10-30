import jwt, { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import SidToUidMap from 'structs/SidToUidMap';

const authMiddleware = (
  socket: Socket,
  next: (err?: Error | undefined) => void,
): void => {
  const authHeader = socket.handshake.headers.authorization;
  const accessToken = authHeader?.split('Bearer ').pop();
  try {
    const decoded = jwt.verify(
      accessToken!,
      process.env.SUPABASE_JWT_SECRET!,
    ) as JwtPayload;
    SidToUidMap.insertUid(socket.id, decoded.sub!);
    // Join the room
    socket.join(decoded.sub!);
    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
};

export default authMiddleware;
