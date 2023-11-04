import { Box, VStack } from '@chakra-ui/react';
// import { useEffect } from 'react';
// import useWindowDimensions from '@/utils/hookUtils';

import { Language } from '@/types/code';
import dynamic from 'next/dynamic';

function CollabRoomRight() {
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
