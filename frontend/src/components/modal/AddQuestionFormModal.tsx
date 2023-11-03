'use client';

import { Button } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
  Question,
  QuestionCategory,
  QuestionDifficulty,
} from '@/types/question';
import { useCreateQuestionMutation } from '@/hooks/useCreateQuestionMutation';
import { useSession } from '@/contexts/SupabaseProvider';
import Modal from './Modal';
import AddQuestionForm from '../form/AddQuestionForm';

interface CategoryOption {
  label: string;
  value: string;
}

function AddQuestionFormModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const modalTitle = 'Add Question';
  const initialRef = useRef(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState<QuestionCategory[]>([]);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(
    QuestionDifficulty.EASY,
  );
  const [link, setLink] = useState('');
  const session = useSession();

  const createQuestionMutation = useCreateQuestionMutation(
    onClose,
    session?.access_token ?? '',
  );

  const changeCategories = (newValues: CategoryOption[]) => {
    setCat(newValues.map((option) => option.value as QuestionCategory));
  };

  const handleSubmit = () => {
    const question: Question = {
      title,
      description: desc,
      categories: cat,
      difficulty,
      link,
    };

    createQuestionMutation.mutate({
      ...question,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      initialRef={initialRef}
      actions={
        <>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            isDisabled={createQuestionMutation.isLoading}
          >
            Save
          </Button>
          <Button onClick={onClose}>
            {createQuestionMutation.isLoading ? 'Minimise' : 'Cancel'}
          </Button>
        </>
      }
    >
      <AddQuestionForm
        initialRef={initialRef}
        changeCategories={changeCategories}
        changeDifficulty={(e) =>
          setDifficulty(e.target.value as QuestionDifficulty)
        }
        changeDescription={(e) => setDesc(e.target.value)}
        changeTitle={(e) => setTitle(e.target.value)}
        changeLink={(e) => setLink(e.target.value)}
      />
    </Modal>
  );
}

export default AddQuestionFormModal;
