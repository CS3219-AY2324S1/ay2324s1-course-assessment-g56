import {
  ColumnDef,
  createColumnHelper,
  Row,
  SortingFn,
} from '@tanstack/react-table';
import {
  QuestionDifficulty,
  QuestionDifficultyToNumberMap,
  QuestionRowData,
} from '@/types/question';
import EditCell from '@/components/table/EditCell';

const columnHelper = createColumnHelper<QuestionRowData>();

const DifficultySortingFn: SortingFn<QuestionRowData> = (
  rowA: Row<QuestionRowData>,
  rowB: Row<QuestionRowData>,
): number => {
  const questionDifficultyA: QuestionDifficulty = rowA.getValue('difficulty');
  const questionDifficultyB: QuestionDifficulty = rowB.getValue('difficulty');
  const rowADifficultyLevel: number =
    QuestionDifficultyToNumberMap[questionDifficultyA];
  const rowBDifficultyLevel: number =
    QuestionDifficultyToNumberMap[questionDifficultyB];
  if (rowADifficultyLevel > rowBDifficultyLevel) {
    return 1;
  }
  return rowADifficultyLevel < rowBDifficultyLevel ? -1 : 0;
};

const defaultColumns = [
  columnHelper.display({
    cell: (props) =>
      props.table
        .getSortedRowModel()
        .flatRows.map((row) => row.id)
        .indexOf(props.row.id) + 1,
    header: 'ID',
    id: 'questionId',
    meta: {
      type: 'number',
    },
  }),
  columnHelper.accessor('title', {
    cell: (title) => title.getValue(),
    header: 'Title',
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('categories', {
    cell: (categories) => categories.getValue().join(', '),
    header: 'Categories',
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('difficulty', {
    cell: (difficulty) => difficulty.getValue(),
    sortingFn: DifficultySortingFn,
    header: 'Difficulty',
    meta: {
      type: 'string',
    },
  }),
  columnHelper.accessor('link', {
    cell: (link) => link.getValue(),
    header: 'Link',
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
