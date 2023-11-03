'use client';

import { useQuestionData } from '@/hooks/useQuestionData';
import {
  QuestionCategory,
  QuestionDifficultyToColourMap,
} from '@/types/question';
import {
  VStack,
  useColorModeValue,
  IconButton,
  Skeleton,
  Text,
  Link,
  Card,
  CardBody,
  Flex,
  HStack,
  Heading,
  Tag,
  Icon,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';

interface QuestionCardProps {
  slug: string;
  access_token: string;
}

function QuestionCard({ slug, access_token }: QuestionCardProps) {
  const router = useRouter();
  const { data: fetchedQuestion, isLoading: questionLoading } = useQuestionData(
    slug,
    access_token ?? '',
  );
  const difficultyColour =
    QuestionDifficultyToColourMap[fetchedQuestion?.difficulty];
  return (
    <VStack
      bg={useColorModeValue('white', 'gray.900')}
      spacing={4}
      py="10"
      pb="10"
    >
      <Flex w="100%" align="center" justify="space-between">
        <IconButton
          aria-label="Back"
          icon={<FiArrowLeft />}
          onClick={() => router.push('/home')}
          boxSize="54px"
          fontSize={30}
          ml="2.5rem"
          colorScheme="teal"
        />
        <Skeleton
          isLoaded={!questionLoading}
          borderRadius="0.375rem"
          maxW="calc(100% - 248px)"
        >
          <Heading fontSize="3xl" fontWeight="bold">
            {fetchedQuestion?.title}
          </Heading>
        </Skeleton>
        <div style={{ marginRight: '2.5rem', width: '54px' }} />
      </Flex>
      <Skeleton isLoaded={!questionLoading} borderRadius="0.375rem">
        <HStack spacing={2}>
          <Tag key="difficulty" colorScheme={difficultyColour}>
            {fetchedQuestion?.difficulty}
          </Tag>
          {fetchedQuestion?.categories.map((category: QuestionCategory) => (
            <Tag key={category} colorScheme="blue">
              {category}
            </Tag>
          ))}
        </HStack>
      </Skeleton>
      <Card w="90%">
        <CardBody>
          <Skeleton isLoaded={!questionLoading} borderRadius="0.375rem">
            <Text fontSize="md" fontWeight="bold">
              <Link isExternal href={`${fetchedQuestion?.link}`}>
                {fetchedQuestion?.link} <Icon as={FiExternalLink} mx="2px" />
              </Link>
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!questionLoading} borderRadius="0.375rem">
            <Text>{fetchedQuestion?.description}</Text>
          </Skeleton>
        </CardBody>
      </Card>
    </VStack>
  );
}

export default QuestionCard;
