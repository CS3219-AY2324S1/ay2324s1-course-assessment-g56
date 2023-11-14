import {
  ColumnDef,
  createColumnHelper,
} from '@tanstack/react-table';

import { CollabRowData } from '@/types/collab';
import UserCell from '@/components/table/UserCell';

const columnHelper = createColumnHelper<CollabRowData>();


const defaultColumns = [
  columnHelper.display({
    cell: (props) =>
      props.table
        .getSortedRowModel()
        .flatRows.map((row) => row.id)
        .indexOf(props.row.id) + 1,
    header: 'ID',
    id: 'recordId',
    meta: {
      type: 'number',
    },
  }),
  columnHelper.display({
    cell: UserCell,
    header: 'Partner',
    id: 'partner',
  }),
  columnHelper.accessor('completedTime', {
    cell: (completedTime) => completedTime.getValue(),
    header: 'Completed Time',
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('duration', {
    cell: (duration) => duration.getValue(),
    header: 'Duration',
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('language', {
    cell: (language) => language.getValue(),
    header: 'Language',
    meta: {
      type: 'string',
    },
  })
] as ColumnDef<CollabRowData>[];

export default defaultColumns;

