'use client';

import { useSession } from '@/contexts/SupabaseProvider';
import { useQuestionData } from '@/hooks/useQuestionData';
import { useRoomData } from '@/hooks/useRoomData';
import { useRoomStore } from '@/hooks/useRoomStore';
import {
  QuestionCategory,
  QuestionDifficultyToColourMap,
} from '@/types/question';
import {
  Box,
  Card,
  CardBody,
  HStack,
  Heading,
  IconButton,
  Skeleton,
  Tag,
  VStack,
  Wrap,
  WrapItem,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { VscArrowSwap } from 'react-icons/vsc';
import { useMemo } from 'react';
import { useQuestionListData } from '@/hooks/useQuestionListData';
import { UUID } from 'crypto';
import code from '../markdown/Code';
import pre from '../markdown/Pre';
import strong from '../markdown/Strong';
import style from '../markdown/Style';
import ul from '../markdown/Ul';
import QuestionSelectionModal from '../modal/QuestionSelectionModal';
import InterviewerNotes from '../textarea/InterviewerNotes';

interface CollabRoomLeftProps {
  roomId: UUID;
  username: string;
}

function CollabRoomLeft({ roomId, username }: CollabRoomLeftProps) {
  const { data: roomData, isPending: isRoomLoading } = useRoomData(roomId);
  const session = useSession();
  const userIsInterviewer = useRoomStore((state) => state.userIsInterviewer);
  const { data: questionList, isPending: questionListLoading } =
    useQuestionListData(session?.access_token ?? '');
  const filteredQuestionList = useMemo(
    () =>
      questionList?.filter(
        (question) => question.difficulty === roomData?.difficulty,
      ),
    [questionList, roomData?.difficulty],
  );
  const isUser1 = username === roomData?.user1Details?.username;
  const userString = isUser1 ? 'user1' : 'user2';
  const [userQuestionSlug, partnerQuestionSlug] = isUser1
    ? [roomData?.user1QuestionSlug, roomData?.user2QuestionSlug]
    : [roomData?.user2QuestionSlug, roomData?.user1QuestionSlug];
  const { data: userQuestion, isPending: userQuestionLoading } =
    useQuestionData(userQuestionSlug ?? '', session?.access_token ?? '');
  const { data: partnerQuestion, isPending: partnerQuestionLoading } =
    useQuestionData(partnerQuestionSlug ?? '', session?.access_token ?? '');

  const displayedQuestion = userIsInterviewer ? partnerQuestion : userQuestion;
  const displayedQuestionLoading = userIsInterviewer
    ? partnerQuestionLoading
    : userQuestionLoading;

  const difficultyColour =
    QuestionDifficultyToColourMap[displayedQuestion?.difficulty];

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minW="380px" maxW="380px" maxH="calc(100vh - 80px)" p={0}>
      <VStack
        bg={useColorModeValue('white', 'gray.900')}
        spacing={4}
        p={4}
        maxH={userIsInterviewer ? 'calc(50vh - 96px)' : 'calc(100vh - 80px)'}
        overflow="auto"
      >
        <Skeleton
          isLoaded={!displayedQuestionLoading}
          borderRadius="0.375rem"
          alignSelf="flex-start"
        >
          <HStack w="100%" spacing={2}>
            <Heading fontSize="3xl" fontWeight="bold" mb={1}>
              {displayedQuestion?.title}
            </Heading>
            {userIsInterviewer && (
              <IconButton
                aria-label="Change question"
                icon={<VscArrowSwap />}
                onClick={onOpen}
              />
            )}
          </HStack>
        </Skeleton>
        <Skeleton
          isLoaded={!displayedQuestionLoading}
          borderRadius="0.375rem"
          alignSelf="flex-start"
        >
          <Wrap spacing={2}>
            <WrapItem>
              <Tag key="difficulty" colorScheme={difficultyColour}>
                {displayedQuestion?.difficulty}
              </Tag>
            </WrapItem>
            {displayedQuestion?.categories?.map(
              (category: QuestionCategory) => (
                <WrapItem key={category}>
                  <Tag key={category} colorScheme="blue" py={1}>
                    {category}
                  </Tag>
                </WrapItem>
              ),
            )}
          </Wrap>
        </Skeleton>
        <Card>
          <CardBody width="330px">
            <Skeleton
              isLoaded={!displayedQuestionLoading}
              borderRadius="0.375rem"
              whiteSpace="pre-wrap"
              height="100%"
            >
              <Markdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  pre,
                  strong,
                  ul,
                  style,
                  code,
                }}
              >
                {displayedQuestion?.description}
              </Markdown>
            </Skeleton>
          </CardBody>
        </Card>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        />
      </VStack>
      {userIsInterviewer && (
        <InterviewerNotes roomId={roomId} user={userString} />
      )}
      {!questionListLoading && !isRoomLoading && (
        <QuestionSelectionModal
          isOpen={isOpen}
          onClose={onClose}
          username={username}
          roomData={roomData}
          questionTitle={displayedQuestion?.title}
          questionList={filteredQuestionList}
        />
      )}
    </Box>
  );
}

export default CollabRoomLeft;
