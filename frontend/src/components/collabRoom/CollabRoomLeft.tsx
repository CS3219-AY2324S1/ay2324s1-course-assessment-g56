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
  Textarea,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { VscArrowSwap } from 'react-icons/vsc';
import code from '../markdown/Code';
import pre from '../markdown/Pre';
import strong from '../markdown/Strong';
import style from '../markdown/Style';
import ul from '../markdown/Ul';

interface CollabRoomLeftProps {
  roomId: string;
}

function CollabRoomLeft({ roomId }: CollabRoomLeftProps) {
  const { data: roomData, isPending: isRoomPending } = useRoomData(roomId);
  const session = useSession();
  const userIsInterviewer = useRoomStore((state) => state.userIsInterviewer);
  const { data: question1, isPending: question1Loading } = useQuestionData(
    roomData?.user1QuestionSlug ?? '',
    session?.access_token ?? '',
  );
  const { data: question2, isPending: question2Loading } = useQuestionData(
    roomData?.user2QuestionSlug ?? '',
    session?.access_token ?? '',
  );

  if (isRoomPending) {
    return null;
  }

  const displayedQuestion = userIsInterviewer ? question1 : question2;
  const displayedQuestionLoading = userIsInterviewer
    ? question1Loading
    : question2Loading;

  const difficultyColour =
    QuestionDifficultyToColourMap[displayedQuestion?.difficulty];

  return (
    <Box minW="380px" maxW="380px" maxH="calc(100vh - 80px)" p={0}>
      <VStack
        bg={useColorModeValue('white', 'gray.900')}
        spacing={4}
        p={4}
        maxH="calc(60vh - 112px)"
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
            <IconButton
              aria-label="Change question"
              icon={<VscArrowSwap />}
              // TODO: Implement change question
            />
          </HStack>
        </Skeleton>
        <Skeleton
          isLoaded={!displayedQuestionLoading}
          borderRadius="0.375rem"
          alignSelf="flex-start"
        >
          <HStack spacing={2}>
            <Tag key="difficulty" colorScheme={difficultyColour}>
              {displayedQuestion?.difficulty}
            </Tag>
            {displayedQuestion?.categories?.map(
              (category: QuestionCategory) => (
                <Tag key={category} colorScheme="blue">
                  {category}
                </Tag>
              ),
            )}
          </HStack>
        </Skeleton>
        <Card>
          <CardBody>
            <Skeleton
              isLoaded={!displayedQuestionLoading}
              borderRadius="0.375rem"
              whiteSpace="pre-wrap"
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
      <Textarea
        placeholder="Take interview notes here..."
        h="calc(40vh)"
        mt={4}
      />
    </Box>
  );
}

export default CollabRoomLeft;
