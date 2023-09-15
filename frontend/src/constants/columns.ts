import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { QuestionRowData } from '@/types/question';
import EditCell from '@/components/table/EditCell';

const columnHelper = createColumnHelper<QuestionRowData>();

const defaultColumns = [
  columnHelper.accessor('questionId', {
    cell: (id) => id.getValue(),
    header: 'ID',
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('questionTitle', {
    cell: (title) => title.getValue(),
    header: 'Title',
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('questionCategories', {
    cell: (categories) => categories.getValue().join(', '),
    header: 'Categories',
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('questionComplexity', {
    cell: (complexity) => complexity.getValue(),
    header: 'Complexity',
    meta: {
      type: 'string',
    },
  }),
  columnHelper.display({
    id: 'edit',
    cell: EditCell,
  }),
] as ColumnDef<QuestionRowData>[];

export default defaultColumns;
