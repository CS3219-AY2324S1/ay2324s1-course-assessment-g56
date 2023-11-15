'use client';

import { CellContext } from '@tanstack/react-table';
import { QuestionRowData } from '@/types/question';
import { IconButton } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';

function EditCell({ row, table }: CellContext<QuestionRowData, any>) {
  return (
    <IconButton
      onClick={() => table.options.meta!.removeRow(row.original.uuid)}
      variant="solid"
      colorScheme="red"
      aria-label="Delete Row"
      fontSize="20px"
      icon={<FiTrash2 />}
    />
  );
}

export default EditCell;
