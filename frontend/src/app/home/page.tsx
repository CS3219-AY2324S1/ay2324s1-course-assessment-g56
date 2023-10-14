'use client';

import {
  Button,
  Flex,
  Heading,
  Spacer,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Table from '@/components/table/Table';
import defaultColumns from '@/constants/columns';
import { deleteQuestionById, getQuestions } from '@/lib/questions';
import {
  Question,
  QuestionRowData,
  NumberToQuestionComplexityMap,
} from '@/types/question';
import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import QuestionFormModal from '@/components/modal/QuestionFormModal';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { QUESTION_LIST_KEY } from '@/types/queryKey';

const getData = async () => {
  const questions = await getQuestions();
  const questionList = questions.map((question: Question, idx: number) => {
    const questionId: number = idx + 1;
    return {
      questionId,
      ...question,
      complexity:
        NumberToQuestionComplexityMap[parseInt(question.complexity, 10)],
    };
  });
  return questionList;
};

export default function Page() {
  const modalTitle = 'Add Question';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const { data: questionList } = useQuery({
    queryKey: [QUESTION_LIST_KEY],
    queryFn: getData,
    onSuccess: () => {
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });
  const queryClient = useQueryClient();

  const removeRow = async (id: number) => {
    setLoading(true);
    const questions = queryClient.getQueryData([QUESTION_LIST_KEY]);
    const questionToRemove = questions.find(
      (question: QuestionRowData) => question.questionId === id,
    );
    try {
      await deleteQuestionById(questionToRemove.uuid);
      queryClient.invalidateQueries([QUESTION_LIST_KEY]);
      setLoading(false);
      toast({
        title: 'Question deleted.',
        description: "We've deleted your question.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '20px',
        },
      });
    } catch (error) {
      toast({
        title: 'Something Went Wrong.',
        description: "We've failed to delete your question.",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '20px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" margin={2}>
        <Heading fontSize="3xl" fontWeight="bold">
          Questions
        </Heading>
        <Spacer />
        <Button
          leftIcon={<FiPlus />}
          variant="solid"
          colorScheme="blue"
          onClick={onOpen}
        >
          {modalTitle}
        </Button>
      </Flex>
      {loading ? (
        <Spinner size="sm" color="blue.500" />
      ) : (
        <>
          <Table
            tableData={questionList}
            removeRow={removeRow}
            columns={defaultColumns}
          />
          <QuestionFormModal isOpen={isOpen} onClose={onClose} />
        </>
      )}
    </>
  );
}
