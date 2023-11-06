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

import { useRoomData } from '@/hooks/useRoomData';
import { useUserData } from '@/hooks/useUserData';
import { RoomProvider } from './RoomContext';
import CloseRoomButton from './CloseRoomButton';
import SkeletonArray from '../skeleton/SkeletonArray';

interface Props {
  roomId: string;
}

function CollabRoomRight({ roomId }: Props): ReactElement<Props, 'div'> {
  const { data: roomData, isPending: isRoomPending } = useRoomData(roomId);
  const { data: user, isPending: isUserPending } = useUserData();

  if (isRoomPending || isUserPending) {
    return <SkeletonArray />;
  }

  const { username1, language1 } = {
    username1: user.username,
    language1: user.preferredInterviewLanguage,
  };
  const { username2, language2 } =
    user.username === roomData.user1Username
      ? { username2: roomData.user2Username, language2: roomData.user2PreferredLanguage }
      : {
          username2: roomData.user1Username,
          language2: roomData.user1PreferredLanguage,
        };


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
            <VideoCollection roomId={roomId} partnerUsername={username2} />
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
