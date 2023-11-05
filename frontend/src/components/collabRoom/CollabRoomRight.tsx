import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  HStack,
  Spacer,
} from '@chakra-ui/react';

import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { Language } from '@/types/code';

import { RoomProvider } from './RoomContext';
import CloseRoomButton from './CloseRoomButton';

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
    <RoomProvider>
      <VStack spacing={2} align="start" height="100vh">
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
                  // eslint-disable-next-line react/jsx-boolean-value
                  isUser1={true}
                />
              </TabPanel>

              <TabPanel height="60vh">
                <CodeEditor
                  language={language2}
                  // TODO: replace this with an actual room slug generator
                  roomSlug={username2 + username1}
                  username={username2}
                  isUser1={false}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Bottom Half of room right */}
        <VStack height="30vh" width="100%">
          {/* Search bar */}
          {/* Video Window */}
          <HStack width="100%">
            <Spacer />
            <VideoCollection roomId="TEST" partnerUsername={username2} />
          </HStack>

          {/* Close Room button */}
          <HStack width="100%">
            <Spacer />
            <CloseRoomButton />
          </HStack>
        </VStack>
      </VStack>
    </RoomProvider>
  );
}

export default CollabRoomRight;
