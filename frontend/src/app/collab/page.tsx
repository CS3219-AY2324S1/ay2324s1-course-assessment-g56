'use client';

// import VideoCollection from '@/components/video/VideoCollection';
import { Box, VStack } from '@chakra-ui/react';
// import { useEffect } from 'react';
import useWindowDimensions from '@/utils/hookUtils';

import { Language } from '@/types/code';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

function Page() {
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

  const { width, height } = useWindowDimensions();
  const fullLength = height - 96; // 48 (top) + 48 (bottom)
  const editorSize = 0.5;
  const finalHeight = `${fullLength * editorSize - 16}px`;
  const finalWidth = '100%';
  const language = Language.PYTHON_THREE;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:6006/`, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    setSocket(newSocket);
    // Cleanup the socket connection when the component is unmounted
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <VStack>
      <Box>
        <VideoCollection roomId="TEST" partnerUsername="TEST" />
        {/* <Text>Collab</Text> */}
      </Box>
      <CodeEditor
        height={finalHeight}
        language={language}
        roomSlug="TEST"
        socket={socket}
        username="Linus"
        width={finalWidth}
      />
    </VStack>
  );
}

export default Page;
