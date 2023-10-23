'use client';

import { createQuestion } from '@/lib/questions';
import { Button, useToast } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
  NumberToQuestionComplexityMap,
  Question,
  QuestionComplexity,
  QuestionRowData,
} from '@/types/question';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { QUESTION_LIST_KEY } from '@/types/queryKey';

import { DatabaseQuestion } from '@/types/database.types';
import Modal from './Modal';
import QuestionForm from '../form/QuestionForm';

function QuestionFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalTitle = 'Add Question';
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('');
  const [complexity, setComplexity] = useState<QuestionComplexity>(
    QuestionComplexity.EASY,
  );
  const [link, setLink] = useState('');

  const toast = useToast();
  const queryClient = useQueryClient();
  const mutateQuestion = useMutation({
    mutationFn: createQuestion,
    onSuccess: (data) => {
      const questionList: QuestionRowData[] | undefined =
        queryClient.getQueryData([QUESTION_LIST_KEY]);
      if (questionList !== undefined) {
        const newQuestionId = questionList.length + 1;
        const dataWithQuestionId = {
          ...(data as DatabaseQuestion),
          questionId: newQuestionId,
          complexity:
            NumberToQuestionComplexityMap[
              (data as DatabaseQuestion).complexity
            ],
        };

        const newQuestionList = [...questionList, dataWithQuestionId];
        queryClient.setQueryData([QUESTION_LIST_KEY], newQuestionList);
      }

      toast({
        title: 'Question added.',
        description: "We've added your question.",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '20px',
        },
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'An error has occurred.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '20px',
        },
      });
    },
    onSettled: () => {
      onClose();
    },
  });

  const handleSubmit = () => {
    const question: Question = {
      title,
      description: desc,
      category: cat,
      complexity,
      link,
    };

    mutateQuestion.mutate({
      ...question,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      initialRef={initialRef}
      finalRef={finalRef}
      actions={
        <>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </>
      }
    >
      <QuestionForm
        initialRef={initialRef}
        changeCategories={(e) => setCat(e.target.value)}
        changeComplexity={(e) =>
          setComplexity(e.target.value as QuestionComplexity)
        }
        changeDescription={(e) => setDesc(e.target.value)}
        changeTitle={(e) => setTitle(e.target.value)}
        changeLink={(e) => setLink(e.target.value)}
      />
    </Modal>
  );
}

export default QuestionFormModal;
