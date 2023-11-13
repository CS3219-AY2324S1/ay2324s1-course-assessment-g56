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
  Textarea,
  // HStack,
} from '@chakra-ui/react';

import React, { ReactElement, useMemo } from 'react';
// import dynamic from 'next/dynamic';

import { useRoomData } from '@/hooks/useRoomData';
import { ProfileData } from '@/types/profile';
import { UUID } from 'crypto';
import { RoomProvider } from './RoomContext';
import { useRoomStore } from '../../hooks/useRoomStore';
import CodeViewer from '../codeEditor/CodeViewer';
import { formatJudge0Message } from '../codeEditor/CodeResultFunctions';

interface Props {
  roomId: UUID;
  user: ProfileData;
}

function PastRoomRight({ roomId, user }: Props): ReactElement<Props, 'div'> {
  const { data: roomData, isPending: isRoomPending } = useRoomData(roomId);
  const changeInterviewer = useRoomStore((state) => state.changeInterviewer);

  const { username1, language1 } = {
    username1: user?.username,
    language1: roomData?.user1Language,
  };

  const { username2, language2 } =
    user?.username === roomData?.user1Details?.username
      ? {
          username2: roomData?.user2Details?.username,
          language2: roomData?.user2Language,
        }
      : {
          username2: roomData?.user1Details?.username,
          language2: roomData?.user1Language,
        };

  // const { question1, question2 } =
  //   user?.username === roomData?.user1Details?.username
  //     ? {
  //         question1: roomData?.user1QuestionSlug,
  //         question2: roomData?.user2QuestionSlug,
  //       }
  //     : {
  //         question1: roomData?.user2QuestionSlug,
  //         question2: roomData?.user1QuestionSlug,
  //       };
  console.log('Past room data: ', roomData);
  const user2Notes =
    roomData.user2Notes == null ? 'No Notes Found' : roomData.user2Notes;

  const user1Code = roomData?.user1Code;
  const user1CodeString =
    user1Code && 'doc' in user1Code
      ? user1Code.doc.toString()
      : 'Code not Found';

  const user2Code = roomData?.user2Code;
  const user2CodeString =
    user2Code && 'doc' in user2Code
      ? user2Code.doc.toString()
      : 'Code not Found';
  const userCodeEditor = useMemo(
    () => (
      <CodeViewer
        selectedLanguage={language1}
        userCode={user1CodeString}
        codeResult={formatJudge0Message(roomData?.user1Result)}
      />
    ),
    [roomId],
  );

  const partnerCodeEditor = useMemo(
    () => (
      <CodeViewer
        selectedLanguage={language2}
        userCode={user2CodeString}
        codeResult={formatJudge0Message(roomData?.user2Result)}
      />
    ),
    [roomId],
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
          {/* Notes: User 2 */}
          <Textarea
            value={
              user2Notes !== null ? user2Notes.toString() : 'No Notes Found'
            }
            readOnly
            h="calc(40vh)"
            mt={4}
          />
        </VStack>
      </VStack>
    </RoomProvider>
  );
}

export default PastRoomRight;
