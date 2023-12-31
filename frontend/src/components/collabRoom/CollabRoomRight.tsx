'use client';

import {
  Box,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  HStack,
} from '@chakra-ui/react';

import React, { ReactElement, useMemo } from 'react';
import dynamic from 'next/dynamic';

import { useRoomData } from '@/hooks/useRoomData';
import { ProfileData } from '@/types/profile';
import { UUID } from 'crypto';
import { RoomProvider } from './RoomContext';
import CloseRoomButton from './CloseRoomButton';
import { useRoomStore } from '../../hooks/useRoomStore';

interface Props {
  roomId: UUID;
  user: ProfileData;
}

function CollabRoomRight({ roomId, user }: Props): ReactElement<Props, 'div'> {
  const { data: roomData, isPending: isRoomPending } = useRoomData(roomId);
  const changeInterviewer = useRoomStore((state) => state.changeInterviewer);

  const { username1, language1 } = {
    username1: user?.username,
    language1: user?.preferredInterviewLanguage,
  };

  const { username2, language2 } =
    user?.username === roomData?.user1Details?.username
      ? {
          username2: roomData?.user2Details?.username,
          language2: roomData?.user2Details?.preferredInterviewLanguage,
        }
      : {
          username2: roomData?.user1Details?.username,
          language2: roomData?.user1Details?.preferredInterviewLanguage,
        };

  const { question1, question2 } =
    user?.username === roomData?.user1Details?.username
      ? {
          question1: roomData?.user1QuestionSlug,
          question2: roomData?.user2QuestionSlug,
        }
      : {
          question1: roomData?.user2QuestionSlug,
          question2: roomData?.user1QuestionSlug,
        };

  const VideoCollection = dynamic(
    () => import('@/components/video/VideoCollection'),
    {
      ssr: false,
    },
  );

  const videoCollection = useMemo(
    () => (
      <VideoCollection
        roomId={roomId}
        username={username1}
        partnerUsername={username2}
      />
    ),
    [roomId, username1, username2],
  );

  const CodeEditor = dynamic(
    () => import('@/components/codeEditor/CodeEditor'),
    { ssr: false },
  );

  const userCodeEditor = useMemo(
    () => (
      <CodeEditor
        roomId={roomId}
        language={language1}
        // TODO: replace this with an actual room slug generator
        roomSlug={`${roomId}-${username1}`}
        username={username1}
        questionSlug={question1}
        isUser1
      />
    ),
    [language1, roomId, username1],
  );

  const partnerCodeEditor = useMemo(
    () => (
      <CodeEditor
        roomId={roomId}
        language={language2}
        // TODO: replace this with an actual room slug generator
        roomSlug={`${roomId}-${username2}`}
        username={username2}
        questionSlug={question2}
        isUser1={false}
      />
    ),
    [language2, roomId, username2],
  );

  return (
    <RoomProvider basicRoomState={roomData}>
      <VStack
        spacing={2}
        align="start"
        maxH="calc(100vh - 112px)"
        p={4}
        width="calc(100vw - 412px)"
      >
        <Skeleton
          isLoaded={!isRoomPending}
          borderRadius="0.375rem"
          width="100%"
        >
          <Box width="100%">
            <Tabs onChange={changeInterviewer}>
              <TabList>
                <Tab>{username1}</Tab>
                <Tab>{username2}</Tab>
              </TabList>

              <TabPanels>
                <TabPanel height="55vh" p={0} pt={4}>
                  {userCodeEditor}
                </TabPanel>

                <TabPanel height="55vh" p={0} pt={4}>
                  {partnerCodeEditor}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Skeleton>

        {/* Bottom Half of room right */}
        <VStack height="20vh" width="100%">
          {/* Search bar */}
          {/* Video Window */}
          <HStack width="100%" justify="right">
            {videoCollection}
          </HStack>

          {/* Close Room button */}
          <HStack width="100%" justify="right">
            <CloseRoomButton />
          </HStack>
        </VStack>
      </VStack>
    </RoomProvider>
  );
}

export default CollabRoomRight;
