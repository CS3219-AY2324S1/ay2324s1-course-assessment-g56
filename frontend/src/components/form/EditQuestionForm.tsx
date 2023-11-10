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
  useColorMode,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { FiArrowLeft } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';
import { useQuestionData } from '@/hooks/useQuestionData';
import { useUpdateQuestionMutation } from '@/hooks/useUpdateQuestionMutation';
import { useRouter } from 'next/navigation';
import MDEditor from '@uiw/react-md-editor';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

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
          <Skeleton
            isLoaded={question !== null}
            borderRadius="0.375rem"
            w="100%"
            mr={5}
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

      <FormControl id="categories" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Categories:{' '}
          </FormLabel>
          <Skeleton
            isLoaded={question !== null}
            maxH={24}
            borderRadius="0.375rem"
            w="100%"
            mr={5}
          >
            <Select
              isMulti
              hideSelectedOptions
              instanceId={1}
              name="categories"
              colorScheme="blue"
              options={categoryOptions}
              defaultValue={question?.categories.map((category) => ({
                value: category,
                label: category,
              }))}
              isOptionDisabled={() => question?.categories.length >= 6}
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
          <Skeleton
            isLoaded={question !== null}
            borderRadius="0.375rem"
            width="100%"
            mr={5}
          >
            <MDEditor
              value={question?.description ?? ''}
              onChange={(value) => {
                setQuestion({
                  ...question,
                  description: value,
                } as QuestionRowData);
              }}
              data-color-mode={useColorMode().colorMode}
              height="100%"
              style={{ width: '100%' }}
              visibleDragbar={false}
              previewOptions={{
                remarkPlugins: [remarkGfm, remarkMath],
                // @ts-expect-error
                rehypePlugins: [rehypeKatex],
              }}
            />
          </Skeleton>
        </Flex>
      </FormControl>

      <FormControl id="difficulty" isRequired>
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Difficulty:{' '}
          </FormLabel>
          <Skeleton
            isLoaded={question !== null}
            borderRadius="0.375rem"
            w="100%"
            mr={5}
          >
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
          <Skeleton
            isLoaded={question !== null}
            borderRadius="0.375rem"
            w="100%"
            mr={5}
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
        isLoading={updateQuestionMutation.isPending}
        loadingText="Saving"
        isDisabled={questionLoading || !validQuestionForm}
      >
        Save Changes
      </Button>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
      />
    </VStack>
  );
}

export default EditQuestionForm;
