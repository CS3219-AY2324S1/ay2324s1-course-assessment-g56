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
import { deleteQuestionById } from '@/lib/questions';
import { QuestionRowData } from '@/types/question';
import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import QuestionFormModal from '@/components/modal/QuestionFormModal';
import { useQueryClient } from '@tanstack/react-query';
import { QUESTION_LIST_KEY } from '@/types/queryKey';
import { useUserData } from '@/hooks/useUserData';
import { useQuestionData } from '@/hooks/useQuestionData';

export default function Page() {
  const modalTitle = 'Add Question';
  const queryClient = useQueryClient();
  const { data: profileData, isLoading: profileLoading } = useUserData();
  const { data: questionList, isLoading: questionLoading } = useQuestionData();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    if (!profileLoading && !questionLoading) {
      setLoading(false);
    }
  }, [profileLoading, questionLoading]);

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
      {/* eslint-disable react/jsx-no-useless-fragment */}
      {loading ? (
        <Spinner size="sm" color="blue.500" />
      ) : (
        <>
          <Flex minWidth="max-content" alignItems="center" gap="2" margin={2}>
            <Heading fontSize="3xl" fontWeight="bold">
              Questions
            </Heading>
            <Spacer />
            {profileData !== undefined && profileData.role !== 'Maintainer' ? (
              <></>
            ) : (
              /* eslint-disable react/jsx-no-useless-fragment */
              <Button
                leftIcon={<FiPlus />}
                variant="solid"
                colorScheme="blue"
                onClick={onOpen}
              >
                {modalTitle}
              </Button>
            )}
          </Flex>
          {profileLoading || questionLoading ? (
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
      )}
    </>
  );
}
