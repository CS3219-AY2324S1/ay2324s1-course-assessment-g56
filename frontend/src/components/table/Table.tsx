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
} from '@chakra-ui/react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  RowData,
} from '@tanstack/react-table';
import { useState } from 'react';
import NextLink from 'next/link';
import TableHeader from './TableHeader';
import { Tr, flexRender } from './TableUtils';

interface TableProps<T extends object> {
  tableData: T[];
  removeRow: (id: number) => void;
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
  isSortable?: boolean;
}

declare module '@tanstack/table-core' {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    removeRow: (id: number) => void;
  }
}

const skeletonRows = Array.from({ length: 10 });

function Table<T extends object>({
  tableData,
  removeRow,
  columns,
  isLoading = false,
  isSortable = true,
}: TableProps<T>) {
  const [sortBy, setSortBy] = useState<SortingState>([]);
  const table = useReactTable<T>({
    data: tableData,
    columns,
    meta: {
      removeRow: (id: number) => {
        removeRow(id + 1);
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
  });

  return (
    <Card variant="outline">
      <ChakraTable size="sm">
        <TableHeader
          headerGroups={table.getHeaderGroups()}
          isSortable={isSortable}
        />
        <Tbody>
          {isLoading
            ? skeletonRows.map(() => (
                <Tr>
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
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) =>
                cell.column.id === 'title' ? (
                  <LinkBox as={Td} key={cell.id}>
                    <LinkOverlay
                      as={NextLink}
                      href={`/question/${parseInt(row.id, 10) + 1}`}
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
    </Card>
  );
}

export default Table;
