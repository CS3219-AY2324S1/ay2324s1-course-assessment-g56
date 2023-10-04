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
import defaultColumns from '@/constants/columns';
import { deleteQuestionById, getQuestions } from '@/lib/questions';
import { Question, QuestionRowData } from '@/types/question';
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import QuestionFormModal from '@/components/modal/QuestionFormModal';
import AuthForm from '@/components/login/AuthForm';

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
      <div className="col-6 auth-widget">
        <AuthForm />
      </div>{' '}
    </>
  );
}
