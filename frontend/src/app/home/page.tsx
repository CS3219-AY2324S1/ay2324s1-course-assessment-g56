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
import {
  Question,
  QuestionRowData,
  QuestionComplexity,
  QuestionComplexityToDisplayText,
} from '@/types/question';
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import QuestionFormModal from '@/components/modal/QuestionFormModal';

const uuidMapping: Record<number, string> = {};

const getData = async () => {
  const questions = await getQuestions();
  const questionList = questions.map((question: Question, idx: number) => {
    const questionId: number = idx + 1;
    uuidMapping[questionId] = question.uuid as string;

    return {
      questionId,
      ...question,
      complexity: QuestionComplexityToDisplayText(
        QuestionComplexity[question.complexity],
      ),
    };
  });
  return questionList;
};

export { uuidMapping, getData };

export default function Page() {
  const modalTitle = 'Add Question';
  const [questionList, setQuestionList] = useState<QuestionRowData[]>([]);
  const [added, setAdded] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const removeRow = (id: number) => {
    const uuid = uuidMapping[id + 1];
    deleteQuestionById(uuid);

    getData()
      .then((data) => {
        setQuestionList(data);
        setAdded(true);
      })
      .catch((error) => {
        throw error;
      });

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

  const handlePopState = (event) => {
    const updatedQuestion = event.state?.updatedQuestion;

    if (updatedQuestion) {
      getData()
        .then((data) => {
          setQuestionList(data);
          setAdded(false);
        })
        .catch((error) => {
          throw error;
        });
    }
  };

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    if (added) {
      getData()
        .then((data) => {
          setQuestionList(data);
          setAdded(false);
        })
        .catch((error) => {
          throw error;
        });
    }
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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
          uuidMapping={uuidMapping}
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
