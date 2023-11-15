'use client';

import { Th, Thead } from '@chakra-ui/react';
import { HeaderGroup } from '@tanstack/react-table';
import SortIcon from './SortIcon';
import { Tr, flexRender } from './TableUtils';

interface TableHeaderProps<T extends object> {
  headerGroups: HeaderGroup<T>[];
  isSortable: boolean;
}

function TableHeader<T extends object>({
  headerGroups,
  isSortable,
}: TableHeaderProps<T>) {
  return (
    <Thead>
      {headerGroups.map((headerGroup) => (
        <Tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const sortDirection = header.column.getIsSorted();
            return (
              <Th
                key={header.id}
                {...(isSortable && {
                  onClick: header.column.getToggleSortingHandler(),
                })}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {header.id !== 'edit' && sortDirection && (
                  <SortIcon isAscending={sortDirection === 'asc'} />
                )}
              </Th>
            );
          })}
        </Tr>
      ))}
    </Thead>
  );
}

export default TableHeader;
