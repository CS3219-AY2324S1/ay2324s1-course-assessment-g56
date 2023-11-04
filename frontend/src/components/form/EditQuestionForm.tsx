'use client';

import {
  QuestionCategory,
  QuestionDifficulty,
  QuestionRowData,
  questionCategories,
} from '@/types/question';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select as ChakraSelect,
  Skeleton,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { FiArrowLeft } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';
import { useQuestionData } from '@/hooks/useQuestionData';
import { useUpdateQuestionMutation } from '@/hooks/useUpdateQuestionMutation';
import { useRouter } from 'next/navigation';

interface EditQuestionFormProps {
  slug: string;
  access_token: string;
}

interface CategoryOption {
  label: string;
  value: string;
}

const categoryOptions: CategoryOption[] = questionCategories.map(
  (category) => ({
    label: category,
    value: category,
  }),
);

function EditQuestionForm({ slug, access_token }: EditQuestionFormProps) {
  const [question, setQuestion] = useState<QuestionRowData | null>(null);
  const validQuestionForm =
    question?.description &&
    question?.title &&
    question?.categories?.length > 0 &&
    question?.difficulty;
  const router = useRouter();

  const { data: fetchedQuestion, isPending: questionLoading } = useQuestionData(
    slug,
    access_token ?? '',
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

  const handleChangeCategories = (newValues: CategoryOption[]) => {
    setQuestion({
      ...question,
      categories: newValues.map((value) => value.value as QuestionCategory),
    } as QuestionRowData);
  };

  const updateQuestionMutation = useUpdateQuestionMutation(
    slug,
    access_token ?? '',
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
          <Skeleton isLoaded={question !== null} borderRadius="0.375rem">
            <Input
              type="text"
              name="title"
              // w={{ base: '250px', md: '350px', lg: '550px' }}
              value={(question && question.title) || ''}
              onChange={handleChange}
            />
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="categories" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Categories:{' '}
          </FormLabel>
          <Skeleton
            isLoaded={question !== null}
            maxW="60%"
            maxH={24}
            minW="320px"
            borderRadius="0.375rem"
          >
            <Select
              isMulti
              hideSelectedOptions
              name="categories"
              colorScheme="blue"
              options={categoryOptions}
              defaultValue={question?.categories.map((category) => ({
                value: category,
                label: category,
              }))}
              isOptionDisabled={() => question?.categories.length >= 5}
              placeholder="Select categories"
              closeMenuOnSelect={false}
              onChange={handleChangeCategories}
            />
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="description" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Description:{' '}
          </FormLabel>
          <Skeleton isLoaded={question !== null} borderRadius="0.375rem">
            <Input
              type="text"
              name="description"
              value={(question && question.description) || ''}
              onChange={handleChange}
            />
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="difficulty" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Difficulty:{' '}
          </FormLabel>
          <Skeleton isLoaded={question !== null} borderRadius="0.375rem">
            <ChakraSelect
              name="difficulty"
              value={
                (question && question.difficulty) || QuestionDifficulty.EASY
              }
              onChange={handleChange}
            >
              <option value={QuestionDifficulty.EASY}>Easy</option>
              <option value={QuestionDifficulty.MEDIUM}>Medium</option>
              <option value={QuestionDifficulty.HARD}>Hard</option>
            </ChakraSelect>
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="link">
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Link:{' '}
          </FormLabel>
          <Skeleton isLoaded={question !== null} borderRadius="0.375rem">
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
        isLoading={updateQuestionMutation.isPending}
        loadingText="Saving"
        isDisabled={questionLoading || !validQuestionForm}
      >
        Save Changes
      </Button>
    </VStack>
  );
}

export default EditQuestionForm;
