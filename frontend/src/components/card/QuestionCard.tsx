'use client';

import { useQuestionData } from '@/hooks/useQuestionData';
import { QuestionDifficultyToColourMap } from '@/types/question';
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
  accessToken: string;
}

function QuestionCard({ slug, accessToken }: QuestionCardProps) {
  const router = useRouter();
  const { data: fetchedQuestion, isLoading: questionLoading } = useQuestionData(
    slug,
    accessToken ?? '',
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
      <Flex w="100%" h={54}>
        <IconButton
          aria-label="Back"
          icon={<FiArrowLeft />}
          onClick={() => router.push('/home')}
          height={54}
          width={54}
          fontSize={30}
          ml={10}
          pos="absolute"
          colorScheme="teal"
        />
        <Skeleton
          isLoaded={!questionLoading}
          ml="50%"
          mt="7px"
          transform="translateX(-50%)"
          borderRadius="0.375rem"
        >
          <Heading fontSize="3xl" fontWeight="bold">
            {fetchedQuestion?.title}
          </Heading>
        </Skeleton>
      </Flex>
      <Skeleton isLoaded={!questionLoading} borderRadius="0.375rem">
        <HStack spacing={2}>
          <Tag key="difficulty" colorScheme={difficultyColour}>
            {fetchedQuestion?.difficulty}
          </Tag>
          {fetchedQuestion?.category.split(', ').map((category: string) => (
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
              <Link isExternal href={`//${fetchedQuestion?.link}`}>
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
