import {
  Box,
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
      <Box height="60vh" width="100%">
        <Tabs>
          <TabList>
            <Tab>{username1}</Tab>
            <Tab>{username2}</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <CodeEditor
                language={language1}
                // TODO: replace this with an actual room slug generator
                roomSlug={username1 + username2}
                username={username1}
              />
            </TabPanel>

            <TabPanel>
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
      <Box height="40vh">
        <VideoCollection roomId="TEST" partnerUsername={username2} />
      </Box>
    </VStack>
  );
}

export default CollabRoomRight;
