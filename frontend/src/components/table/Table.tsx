'use client';

import {
  Card,
  Table as ChakraTable,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Tbody,
  Td,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  RowData,
} from '@tanstack/react-table';
import { useState } from 'react';
import NextLink from 'next/link';
import { QuestionRowData } from '@/types/question';
import { Tr, flexRender } from './TableUtils';
import TableHeader from './TableHeader';
import TablePagination from './TablePagination';

interface TableProps<T extends object> {
  tableData: T[];
  removeRow: (uuid: string) => void;
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
  isSortable?: boolean;
  isPaginated?: boolean;
}

declare module '@tanstack/table-core' {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    removeRow: (uuid: string) => void;
  }
}

const skeletonRows = Array.from({ length: 10 }, (_, i) => i);

function Table<T extends object>({
  tableData,
  removeRow,
  columns,
  isLoading = false,
  isSortable = true,
  isPaginated = true,
}: TableProps<T>) {
  const [sortBy, setSortBy] = useState<SortingState>([]);
  const table = useReactTable<T>({
    data: tableData,
    columns,
    meta: {
      removeRow: (uuid: string) => {
        removeRow(uuid);
      },
    },
    state: {
      sorting: isSortable ? sortBy : undefined,
    },
    getCoreRowModel: getCoreRowModel(),
    ...(isSortable && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSortBy,
    }),
    ...(isPaginated && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
  });

  return (
    <Card variant="outline" bg={useColorModeValue('white', 'gray.900')}>
      <ChakraTable size="sm">
        <TableHeader
          headerGroups={table.getHeaderGroups()}
          isSortable={isSortable}
        />
        <Tbody>
          {isLoading
            ? skeletonRows.map((i) => (
                <Tr key={`skeleton-${i}`}>
                  <Td
                    textAlign="center"
                    colSpan={table.getAllColumns().length}
                    paddingY={3}
                  >
                    <Skeleton isLoaded={!isLoading} h="18px" w="100%" />
                  </Td>
                </Tr>
              ))
            : table.getRowModel().rows.length === 0 && (
                <Tr>
                  <Td
                    textAlign="center"
                    colSpan={table.getAllColumns().length}
                    paddingY={8}
                  >
                    <Text color="gray.500">No questions found</Text>
                  </Td>
                </Tr>
              )}
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id} h="40px">
              {row.getVisibleCells().map((cell) =>
                cell.column.id === 'title' ? (
                  <LinkBox as={Td} key={cell.id}>
                    <LinkOverlay
                      as={NextLink}
                      href={`/question/${
                        (row.original as QuestionRowData).slug
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </LinkOverlay>
                  </LinkBox>
                ) : (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ),
              )}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
      {isPaginated && <TablePagination table={table} />}
    </Card>
  );
}

export default Table;
