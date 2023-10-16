'use client';

import { updateQuestionById } from '@/lib/questions';
import {
  Question,
  QuestionComplexity,
  QuestionRowData,
} from '@/types/question';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Select,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUESTION_LIST_KEY } from '@/types/queryKey';

function Page({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState<Question | null>(null);
  const { id } = params;
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutateQuestion = useMutation({
    mutationFn: updateQuestionById,
    onSuccess: (data) => {
      queryClient.setQueryData([QUESTION_LIST_KEY, { id }], data);
      toast({
        title: 'Question updated.',
        description: "We've updated your question.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '20px',
        },
      });
      window.history.back();
    },
    onError: (error) => {
      toast({
        title: 'Fail to update Question.',
        description: `We've failed to update your question.${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '20px',
        },
      });
    },
  });

  useEffect(() => {
    const questionList = queryClient.getQueryData([QUESTION_LIST_KEY]);
    const fetchedQuestion = questionList.find(
      (questionInList: QuestionRowData) =>
        questionInList.questionId === parseInt(id, 10),
    );
    setQuestion(fetchedQuestion);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setQuestion({ ...question, [name]: value } as Question);
  };

  const handleSubmit = () => {
    if (question !== null) {
      mutateQuestion.mutate(question);
    } else {
      toast({
        title: 'Something Went Wrong!',
        description: `Something Went Wrong when submitting: question is null`,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '20px',
        },
      });
    }
  };

  if (!question) {
    return <div>Loading...</div>;
  }
  return (
    <VStack bg="white" spacing={4} py="10" pb="10">
      <IconButton
        aria-label="Back"
        icon={<FiArrowLeft />}
        onClick={() => window.history.back()}
        height={54}
        width={54}
        fontSize={30}
        colorScheme="teal"
      />
      <FormControl id="title">
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Title:{' '}
          </FormLabel>
          <Input
            type="text"
            name="title"
            value={question.title}
            onChange={handleChange}
          />
        </Flex>
      </FormControl>

      <FormControl id="category">
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Category:{' '}
          </FormLabel>
          <Input
            type="text"
            name="category"
            value={question.category}
            onChange={handleChange}
          />
        </Flex>
      </FormControl>

      <FormControl id="description">
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Description:{' '}
          </FormLabel>
          <Input
            type="text"
            name="description"
            value={question.description}
            onChange={handleChange}
          />
        </Flex>
      </FormControl>

      <FormControl id="complexity">
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Difficulty:{' '}
          </FormLabel>
          <Select
            name="complexity"
            value={question.complexity}
            onChange={handleChange}
          >
            <option value={QuestionComplexity.EASY}>Easy</option>
            <option value={QuestionComplexity.MEDIUM}>Medium</option>
            <option value={QuestionComplexity.HARD}>Hard</option>
          </Select>
        </Flex>
      </FormControl>

      <FormControl id="link">
        <Flex alignItems="center">
          <FormLabel pl="4" flex="0 0 120px">
            Link:{' '}
          </FormLabel>
          <Input
            type="text"
            name="link"
            value={question.link}
            onChange={handleChange}
          />
        </Flex>
      </FormControl>
      <Button onClick={handleSubmit} colorScheme="green">
        Save Changes
      </Button>
    </VStack>
  );
}

export default Page;
