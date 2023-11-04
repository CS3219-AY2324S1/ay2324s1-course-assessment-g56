import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';

import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { Language } from '@/types/code';

interface Props {
  username1: string;
  username2: string;
  language1: Language;
  language2: Language;
}

function CollabRoomRight({
  username1,
  username2,
  language1,
  language2,
}: Props): ReactElement<Props, 'div'> {
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

  return (
    <VStack spacing={4} align="start" height="100vh">
      <Box width="100%">
        <Tabs>
          <TabList>
            <Tab>{username1}</Tab>
            <Tab>{username2}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel height="60vh">
              <CodeEditor
                language={language1}
                // TODO: replace this with an actual room slug generator
                roomSlug={username1 + username2}
                username={username1}
              />
            </TabPanel>

            <TabPanel height="60vh">
              <CodeEditor
                language={language2}
                // TODO: replace this with an actual room slug generator
                roomSlug={username2 + username1}
                username={username2}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Bottom Half of room right */}
      <VStack height="40vh">
        {/* Search bar */}
        {/* Video Window */}
        <VideoCollection roomId="TEST" partnerUsername={username2} />
        {/* Close room */}
        <Button colorScheme="red">Close Room</Button>
      </VStack>
    </VStack>
  );
}

export default CollabRoomRight;
