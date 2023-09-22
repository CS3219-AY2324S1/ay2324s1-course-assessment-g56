'use client';

import { createQuestion } from '@/lib/questions';
import { Button, useToast } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Question, QuestionComplexity } from '@/types/question';
import QuestionForm from '../form/QuestionForm';
import Modal from './Modal';

function QuestionFormModal({
  isOpen,
  onClose,
  setAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  setAdded: Dispatch<SetStateAction<boolean>>;
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

  const toast = useToast();

  const saveQuestion = () => {
    const question: Question = {
      questionTitle: title,
      questionDescription: desc,
      questionCategories: cat.split(','),
      questionComplexity: complexity,
    };
    try {
      createQuestion(question);
      setAdded(true);
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
    } catch (error: any) {
      toast({
        title: 'An error has occured.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        containerStyle: {
          marginTop: '20px',
        },
      });
    } finally {
      onClose();
    }
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
          <Button colorScheme="blue" mr={3} onClick={saveQuestion}>
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
          setComplexity(
            QuestionComplexity[
              e.target.value as keyof typeof QuestionComplexity
            ],
          )
        }
        changeDescription={(e) => setDesc(e.target.value)}
        changeTitle={(e) => setTitle(e.target.value)}
      />
    </Modal>
  );
}

export default QuestionFormModal;
