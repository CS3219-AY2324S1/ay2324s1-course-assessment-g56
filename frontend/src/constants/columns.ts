import {
  ColumnDef,
  createColumnHelper,
  Row,
  SortingFn,
} from '@tanstack/react-table';
import {
  QuestionComplexity,
  QuestionComplexityToNumberMap,
  QuestionRowData,
} from '@/types/question';
import EditCell from '@/components/table/EditCell';

const columnHelper = createColumnHelper<QuestionRowData>();

const ComplexitySortingFn: SortingFn<QuestionRowData> = (
  rowA: Row<QuestionRowData>,
  rowB: Row<QuestionRowData>,
): number => {
  const questionComplexityA: QuestionComplexity =
    rowA.getValue('questionComplexity');
  const questionComplexityB: QuestionComplexity =
    rowB.getValue('questionComplexity');
  const rowAComplexityLevel: number =
    QuestionComplexityToNumberMap[questionComplexityA];
  const rowBComplexityLevel: number =
    QuestionComplexityToNumberMap[questionComplexityB];
  if (rowAComplexityLevel > rowBComplexityLevel) {
    return 1;
  }
  return rowAComplexityLevel < rowBComplexityLevel ? -1 : 0;
};

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
    sortingFn: ComplexitySortingFn,
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
