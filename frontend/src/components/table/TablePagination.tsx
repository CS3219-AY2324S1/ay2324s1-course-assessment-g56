import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from 'react-icons/fi';
import {
  Flex,
  Tooltip,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Text,
} from '@chakra-ui/react';
import { Table } from '@tanstack/react-table';

interface TablePaginationProps<T> {
  table: Table<T>;
}

const numEntriesPerPageOptions = [10, 20, 30, 40, 50];

function TablePagination<T extends object>({ table }: TablePaginationProps<T>) {
  const {
    getPageCount,
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
    setPageIndex,
    setPageSize,
    getState,
  } = table;
  const { pageIndex, pageSize } = getState().pagination;
  return (
    <Flex justifyContent="space-between" margin={4} alignItems="center">
      <Flex>
        <Tooltip label="First Page">
          <IconButton
            aria-label="First Page"
            onClick={() => {
              setPageIndex(0);
            }}
            isDisabled={!getCanPreviousPage()}
            icon={<FiArrowLeft height={3} width={3} />}
            mr={4}
          />
        </Tooltip>

        <Tooltip label="Previous Page">
          <IconButton
            aria-label="Previous Page"
            onClick={previousPage}
            isDisabled={!getCanPreviousPage()}
            icon={<FiChevronLeft height={6} width={6} />}
          />
        </Tooltip>
      </Flex>

      <Flex alignItems="center">
        <Text fontSize="sm" flexShrink="0" marginRight={8}>
          {'Page '}
          <Text fontSize="sm" fontWeight="bold" as="span">
            {Math.min(pageIndex + 1, getPageCount())}
          </Text>
          {' of '}
          <Text fontSize="sm" fontWeight="bold" as="span">
            {getPageCount()}
          </Text>
        </Text>

        <Text fontSize="sm" flexShrink="0">
          {'Go to page: '}
        </Text>
        <NumberInput
          size="sm"
          marginLeft={2}
          marginRight={8}
          width={28}
          min={Math.min(1, getPageCount())}
          max={getPageCount()}
          onChange={(_str, num) => {
            if (!Number.isNaN(num)) {
              setPageIndex(Math.min(Math.max(num - 1, 0), getPageCount() - 1));
            }
          }}
          defaultValue={pageIndex + 1}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Select
          size="sm"
          width={32}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {numEntriesPerPageOptions.map((newPageSize) => (
            <option key={newPageSize} value={newPageSize}>
              Show {newPageSize}
            </option>
          ))}
        </Select>
      </Flex>

      <Flex>
        <Tooltip label="Next Page">
          <IconButton
            aria-label="Next Page"
            onClick={nextPage}
            isDisabled={!getCanNextPage()}
            icon={<FiChevronRight height={6} width={6} />}
          />
        </Tooltip>
        <Tooltip label="Last Page">
          <IconButton
            aria-label="Last Page"
            onClick={() => {
              setPageIndex(getPageCount() - 1);
            }}
            isDisabled={!getCanNextPage()}
            icon={<FiArrowRight height={3} width={3} />}
            marginLeft={4}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
}

export default TablePagination;
