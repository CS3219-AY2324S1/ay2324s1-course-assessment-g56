'use client';

// import { Box, VStack } from '@chakra-ui/react';

import CollabRoomRight from '@/components/collabRoom/CollabRoomRight';
import { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

function Page() {
  // const [socket, setSocket] = useState<Socket | null>(null);

  const socket = io(`http://localhost:6006`, {
    autoConnect: false,
  });

  useEffect(
    () =>
      // Cleanup the socket connection when the component is unmounted
      () => {
        socket.disconnect();
      },
    [],
  );

  return <CollabRoomRight socket={socket} />;
}

export default Page;
