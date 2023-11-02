'use client';

import { Button, Flex, Heading, Spacer, useDisclosure } from '@chakra-ui/react';
import Table from '@/components/table/Table';
import defaultColumns from '@/constants/columns';
import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import AddQuestionFormModal from '@/components/modal/AddQuestionFormModal';
import { useUserData } from '@/hooks/useUserData';
import { useQuestionListData } from '@/hooks/useQuestionListData';
import { useSession } from '@/contexts/SupabaseProvider';
import { useDeleteQuestionMutation } from '@/hooks/useDeleteQuestionMutation';

export default function Page() {
  const modalTitle = 'Add Question';
  const session = useSession();
  const { data: questionList, isLoading: questionListLoading } =
    useQuestionListData(session?.access_token ?? '');
  const { data: profileData } = useUserData();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [columns, setColumns] = useState(defaultColumns.slice(0, -1));

  useEffect(() => {
    if (profileData === undefined || profileData!.role !== 'Maintainer') {
      setColumns(defaultColumns.slice(0, -1));
    } else {
      setColumns(defaultColumns);
    }
  }, [profileData]);

  const deleteQuestionMutation = useDeleteQuestionMutation(
    session?.access_token ?? '',
  );
  const removeRow = async (uuid: string) => deleteQuestionMutation.mutate(uuid);

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" margin={2}>
        <Heading fontSize="3xl" fontWeight="bold">
          Questions
        </Heading>
        <Spacer />
        {profileData !== undefined && profileData.role === 'Maintainer' && (
          <>
            <Button
              leftIcon={<FiPlus />}
              variant="solid"
              colorScheme="blue"
              onClick={onOpen}
            >
              {modalTitle}
            </Button>
            <AddQuestionFormModal isOpen={isOpen} onClose={onClose} />
          </>
        )}
      </Flex>
      <Table
        tableData={questionList || []}
        removeRow={removeRow}
        columns={columns}
        isLoading={!session || questionListLoading}
      />
    </>
  );
}
