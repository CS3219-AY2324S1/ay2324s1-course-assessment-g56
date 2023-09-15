'use client';

import {
  Button,
  Flex,
  Heading,
  Spacer,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Table from '@/components/table/Table';
import { defaultColumns } from '@/constants/columns';
import { deleteQuestionById, getQuestions } from '@/lib/questions';
import { Question, QuestionRowData } from '@/types/question';
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import QuestionFormModal from '@/components/modal/QuestionFormModal';

const getData = () => {
  const questions = getQuestions();
  const questionList = questions.map((question: Question, idx: number) => ({
    questionId: idx + 1,
    ...question,
  }));
  return questionList;
};

export default function Page() {
  const modalTitle = 'Add Question';
  const [questionList, setQuestionList] = useState<QuestionRowData[]>([]);
  const [added, setAdded] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const removeRow = (id: number) => {
    deleteQuestionById(id);
    setQuestionList(getData());
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
  };

  useEffect(() => {
    if (!added) return;
    setQuestionList(getData());
    setAdded(false);
  }, [added]);

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
      {questionList !== undefined && (
        <Table
          tableData={questionList}
          removeRow={removeRow}
          columns={defaultColumns}
        />
      )}
      <QuestionFormModal
        isOpen={isOpen}
        onClose={onClose}
        setAdded={setAdded}
      />
    </>
  );
}
