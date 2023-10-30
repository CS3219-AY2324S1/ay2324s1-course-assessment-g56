'use client';

import { QuestionComplexity, QuestionRowData } from '@/types/question';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  Skeleton,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';
import { useQuestionData } from '@/hooks/useQuestionData';
import { useUpdateQuestionMutation } from '@/hooks/useUpdateQuestionMutation';
import { useSession } from '@/contexts/SupabaseProvider';
import { useRouter } from 'next/navigation';

function Page({ params }: { params: { slug: string } }) {
  const [question, setQuestion] = useState<QuestionRowData | null>(null);
  const validQuestionForm =
    question?.description &&
    question?.title &&
    question?.category &&
    question?.complexity;
  const { slug } = params;
  const session = useSession();
  const router = useRouter();

  const { data: fetchedQuestion, isLoading: questionLoading } = useQuestionData(
    slug,
    session?.access_token ?? '',
  );

  useEffect(() => {
    if (fetchedQuestion) {
      setQuestion(fetchedQuestion);
    }
  }, [fetchedQuestion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setQuestion({ ...question, [name]: value } as QuestionRowData);
  };

  const updateQuestionMutation = useUpdateQuestionMutation(
    slug,
    session?.access_token ?? '',
  );

  const handleSubmit = () => {
    updateQuestionMutation.mutate(question!);
  };

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
      <FormControl id="title" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Title:{' '}
          </FormLabel>
          <Skeleton
            isLoaded={question !== null}
            style={{ borderRadius: '0.375rem' }}
          >
            <Input
              type="text"
              name="title"
              value={(question && question.title) || ''}
              onChange={handleChange}
            />
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="category" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Category:{' '}
          </FormLabel>
          <Skeleton
            isLoaded={question !== null}
            style={{ borderRadius: '0.375rem' }}
          >
            <Input
              type="text"
              name="category"
              value={(question && question.category) || ''}
              onChange={handleChange}
            />
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="description" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Description:{' '}
          </FormLabel>
          <Skeleton
            isLoaded={question !== null}
            style={{ borderRadius: '0.375rem' }}
          >
            <Input
              type="text"
              name="description"
              value={(question && question.description) || ''}
              onChange={handleChange}
            />
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="complexity" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Difficulty:{' '}
          </FormLabel>
          <Skeleton
            isLoaded={question !== null}
            style={{ borderRadius: '0.375rem' }}
          >
            <Select
              name="complexity"
              value={
                (question && question.complexity) || QuestionComplexity.EASY
              }
              onChange={handleChange}
            >
              <option value={QuestionComplexity.EASY}>Easy</option>
              <option value={QuestionComplexity.MEDIUM}>Medium</option>
              <option value={QuestionComplexity.HARD}>Hard</option>
            </Select>
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="link">
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Link:{' '}
          </FormLabel>
          <Skeleton
            isLoaded={question !== null}
            style={{ borderRadius: '0.375rem' }}
          >
            <Input
              type="text"
              name="link"
              value={(question && question.link) || ''}
              onChange={handleChange}
            />
          </Skeleton>
        </Flex>
      </FormControl>
      <Button
        onClick={handleSubmit}
        colorScheme="green"
        isDisabled={questionLoading || !validQuestionForm}
      >
        Save Changes
      </Button>
    </VStack>
  );
}

export default Page;