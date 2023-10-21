import { Box, VStack } from '@chakra-ui/react';
// import { useEffect } from 'react';
// import useWindowDimensions from '@/utils/hookUtils';

import { Language } from '@/types/code';
import dynamic from 'next/dynamic';
// import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

function CollabRoomRight(props: { socket: Socket | null }) {
  const { socket } = props;
  const VideoCollection = dynamic(
    () => import('@/components/video/VideoCollection'),
    {
      ssr: false,
    },
  );

  const CodeEditor = dynamic(
    () => import('@/components/codeEditor/CodeEditor'),
    { ssr: false },
  );

  const language = Language.PYTHON_THREE;

  // Socket is not needed for now
  // const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   const onConnect = () => {
  //     setIsConnected(true);
  //     console.log('Connected to server.');
  //   };

  //   socket?.on('connect', onConnect);
  //   socket?.connect();

  //   return (): void => {
  //     socket?.off('connect', onConnect);
  //   };
  // }, []);

  return (
    <VStack spacing={4} align="start" height="100vh">
      <Box height="60vh" width="100%">
        <CodeEditor
          language={language}
          roomSlug="TEST"
          // socket={socket}
          username="Linus"
        />
      </Box>
      <Box height="40vh">
        <VideoCollection roomId="TEST" partnerUsername="TEST" />
      </Box>
    </VStack>
  );
}

export default CollabRoomRight;
