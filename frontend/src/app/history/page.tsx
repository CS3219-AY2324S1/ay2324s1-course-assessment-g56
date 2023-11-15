'use client';

import { Flex, Heading, useToast } from '@chakra-ui/react';
import HistoryTable from '@/components/table/historyTable';
import historyColumns from '@/constants/historyColumns';
import { useEffect } from 'react';
import { useSession } from '@/contexts/SupabaseProvider';
import { useCollabListData } from '@/hooks/useCollabListData';

export default function Page() {
  const session = useSession();
  const {
    data: collabList,
    isPending: collabListLoading,
    isError,
  } = useCollabListData(session?.access_token ?? '');

  const toast = useToast();

  useEffect(() => {
    if (isError && !collabList) {
      toast({
        title: 'Failed to fetch past interviews!',
        description: 'Please refresh the page.',
        status: 'error',
      });
    }
  }, [isError]);

  return (
    <>
      <Flex minWidth="max-content" alignItems="center" gap="2" margin={2}>
        <Heading fontSize="3xl" fontWeight="bold">
          Past Submissions
        </Heading>
      </Flex>
      <HistoryTable
        tableData={collabList || []}
        columns={historyColumns}
        isLoading={!session || collabListLoading}
      />
    </>
  );
}
