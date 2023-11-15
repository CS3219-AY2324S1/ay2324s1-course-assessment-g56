import { Skeleton, VStack } from '@chakra-ui/react';

const arr = Array.from({ length: 10 }, (_, i) => i + 1);

function SkeletonArray() {
  return (
    <VStack spacing={6} align="stretch">
      {arr.map((i) => (
        <Skeleton key={`skeleton-${i}`} h={10} borderRadius="0.375rem" />
      ))}
    </VStack>
  );
}

export default SkeletonArray;
