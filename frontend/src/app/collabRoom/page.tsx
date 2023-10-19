'use client';

// import { Box, VStack } from '@chakra-ui/react';

import CollabRoomRight from '@/components/collabRoom/CollabRoomRight';
import { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

function Page() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:6006/`, {
      autoConnect: false,
    });

    setSocket(newSocket);
    // Cleanup the socket connection when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <CollabRoomRight socket={socket} />;
}

export default Page;
