'use client';

import { useQuestionData } from '@/hooks/useQuestionData';
import {
  VStack,
  useColorModeValue,
  IconButton,
  Skeleton,
  Text,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

interface QuestionCardProps {
  slug: string;
  accessToken: string;
}

function QuestionCard({ slug, accessToken }: QuestionCardProps) {
  const router = useRouter();
  const { data: fetchedQuestion, isLoading: questionLoading } = useQuestionData(
    slug,
    accessToken ?? '',
  );
  return (
    <VStack
      bg={useColorModeValue('white', 'gray.900')}
      spacing={4}
      py="10"
      pb="10"
    >
      <IconButton
        aria-label="Back"
        icon={<FiArrowLeft />}
        onClick={() => router.push('/home')}
        height={54}
        width={54}
        fontSize={30}
        colorScheme="teal"
      />
      <Skeleton
        isLoaded={!questionLoading}
        alignSelf="flex-start"
        ml={10}
        style={{ borderRadius: '0.375rem' }}
      >
        <Text fontSize="xl" fontWeight="bold">
          Title: {fetchedQuestion?.title}
        </Text>
      </Skeleton>
      <Skeleton
        isLoaded={!questionLoading}
        alignSelf="flex-start"
        ml={10}
        style={{ borderRadius: '0.375rem' }}
      >
        <Text fontSize="md" fontWeight="bold">
          Description: {fetchedQuestion?.description}
        </Text>
      </Skeleton>
      <Skeleton
        isLoaded={!questionLoading}
        alignSelf="flex-start"
        ml={10}
        style={{ borderRadius: '0.375rem' }}
      >
        <Text fontSize="md" fontWeight="bold">
          {fetchedQuestion?.category}
        </Text>
      </Skeleton>
      <Skeleton
        isLoaded={!questionLoading}
        alignSelf="flex-start"
        ml={10}
        style={{ borderRadius: '0.375rem' }}
      >
        <Text fontSize="md" fontWeight="bold">
          Difficulty: {fetchedQuestion?.difficulty}
        </Text>
      </Skeleton>
      <Skeleton
        isLoaded={!questionLoading}
        alignSelf="flex-start"
        ml={10}
        style={{ borderRadius: '0.375rem' }}
      >
        <Text fontSize="md" fontWeight="bold">
          Link:{' '}
          <Link href={fetchedQuestion?.link}>{fetchedQuestion?.link}</Link>
        </Text>
      </Skeleton>
    </VStack>
  );
}

export default QuestionCard;
