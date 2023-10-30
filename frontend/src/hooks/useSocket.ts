import { CONNECT, DISCONNECT } from '@/constants/socket';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket =
  process.env.NODE_ENV !== 'production'
    ? io(process.env.NEXT_PUBLIC_MATCHING_SERVICE, {
        autoConnect: false,
      })
    : io(process.env.FRONTEND_SERVICE, {
        path: process.env.MATCHING_PATH,
        autoConnect: false,
      });

const useSocket = (session: Session | null) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (session) {
      socket.io.opts.extraHeaders = {
        authorization: `Bearer ${session.access_token}`,
      };

      const onConnect = () => {
        setIsConnected(true);
      };

      const onDisconnect = () => {
        setIsConnected(false);
      };

      socket.on(CONNECT, onConnect);
      socket.on(DISCONNECT, onDisconnect);
      socket.connect();

      return () => {
        socket.off(CONNECT, onConnect);
        socket.off(DISCONNECT, onDisconnect);
        socket.disconnect();
      };
    }

    return undefined;
  }, [session, socket]);

  return { socket, isConnected };
};

export default useSocket;
