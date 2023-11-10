'use client';

import { useMemo, useRef, useState } from 'react';
import { QuestionRowData } from '@/types/question';
import { Flex, Icon, InputGroup, InputRightElement } from '@chakra-ui/react';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteList,
  AutoCompleteItem,
} from '@choc-ui/chakra-autocomplete';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { useRoomStore } from '@/hooks/useRoomStore';
import { BasicRoomData } from '@/types/collab';
import Modal from './Modal';
import { useUpdateRoomQuestionsMutation } from '../../hooks/useUpdateRoomQuestionsMutation';

interface QuestionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  roomData: BasicRoomData;
  questionTitle: string;
  questionList: QuestionRowData[];
}

function QuestionSelectionModal({
  isOpen,
  onClose,
  username,
  roomData,
  questionTitle,
  questionList,
}: QuestionSelectionModalProps) {
  const modalTitle = 'Change Question';
  const initialRef = useRef(null);
  const setQuestionSlug = useRoomStore((state) => state.setQuestionSlug);

  const questionListMap = useMemo(
    () =>
      questionList.reduce((acc, question) => {
        acc[question.title] = question;
        return acc;
      }, {}),
    [questionList],
  );

  const [selectedQuestionTitle, setSelectedQuestionTitle] =
    useState<string>(questionTitle);

  const emptyState = <Flex justify="center">No questions found!</Flex>;

  const updateRoomQuestionsMutation = useUpdateRoomQuestionsMutation(
    roomData.roomId,
  );

  const questionSlugKey =
    roomData.user1Details.username === username
      ? 'user1QuestionSlug'
      : 'user2QuestionSlug';
  const changeQuestion = (value: string) => {
    setQuestionSlug(questionListMap[value].slug);
    setSelectedQuestionTitle(value);
    updateRoomQuestionsMutation.mutate({
      key: questionSlugKey,
      questionSlug: questionListMap[value].slug,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      title={modalTitle}
      initialRef={initialRef}
    >
      <AutoComplete
        openOnFocus
        listAllValuesOnFocus
        rollNavigation
        suggestWhenEmpty
        defaultValue={selectedQuestionTitle}
        emptyState={emptyState}
        onChange={changeQuestion}
        isLoading={updateRoomQuestionsMutation.isPending}
      >
        {({ isOpen: isDropdownOpen }) => (
          <>
            <InputGroup>
              <AutoCompleteInput variant="filled" placeholder="Search..." />
              <InputRightElement pointerEvents="none">
                <Icon as={isDropdownOpen ? FiChevronRight : FiChevronDown} />
              </InputRightElement>
            </InputGroup>
            <AutoCompleteList>
              {questionList.map((question) => (
                <AutoCompleteItem
                  key={`option-${question.slug}`}
                  value={question.title}
                >
                  {question.title}
                </AutoCompleteItem>
              ))}
            </AutoCompleteList>
          </>
        )}
      </AutoComplete>
    </Modal>
  );
}

export default QuestionSelectionModal;
