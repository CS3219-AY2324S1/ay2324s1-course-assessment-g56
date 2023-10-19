'use client';

import { CellContext } from '@tanstack/react-table';
import { QuestionRowData } from '@/types/question';
import { IconButton } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import { USER_QUERY_KEY } from '@/types/queryKey';
import { useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';

function EditCell({ row, table }: CellContext<QuestionRowData, any>) {
  const queryClient = useQueryClient();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data: ProfileData | undefined = queryClient.getQueryData([
      USER_QUERY_KEY,
    ]);
    if (data !== undefined) {
      setProfileData(data);
      setLoading(false);
    }
  }, [profileData]);

  return !loading &&
    profileData !== null &&
    profileData.role !== 'Maintainer' ? null : (
    <IconButton
      onClick={() => table.options.meta!.removeRow(row.index)}
      variant="solid"
      colorScheme="red"
      aria-label="Delete Row"
      fontSize="20px"
      icon={<FiTrash2 />}
    />
  );
}

export default EditCell;
