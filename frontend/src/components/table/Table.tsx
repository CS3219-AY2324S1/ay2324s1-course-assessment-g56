'use client';

import {
  Card,
  Table as ChakraTable,
  LinkBox,
  LinkOverlay,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  flexRender,
  RowData,
} from '@tanstack/react-table';
import { useState } from 'react';
import NextLink from 'next/link';
import TableHeader from './TableHeader';

interface TableProps<T extends object> {
  tableData: T[];
  removeRow: (id: number) => void;
  columns: ColumnDef<T, any>[];
  isSortable?: boolean;
}

declare module '@tanstack/table-core' {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    removeRow: (id: number) => void;
  }
}

function Table<T extends object>({
  tableData,
  removeRow,
  columns,
  isSortable = true,
}: TableProps<T>) {
  const [sortBy, setSortBy] = useState<SortingState>([]);
  const table = useReactTable<T>({
    data: tableData,
    columns,
    meta: {
      removeRow: (id: number) => {
        removeRow(id);
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
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) =>
                cell.column.id === 'questionTitle' ? (
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
          {table.getRowModel().rows.length === 0 && (
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
        </Tbody>
      </ChakraTable>
    </Card>
  );
}

export default Table;
