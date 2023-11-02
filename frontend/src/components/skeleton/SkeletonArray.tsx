import { Skeleton, VStack } from '@chakra-ui/react';

const skeletonArray = new Array(10).map((_, i) => i + 1);

function SkeletonArray() {
  return (
    <VStack spacing={6} align="stretch">
      {skeletonArray.map((i) => (
        <Skeleton key={`skeleton-${i}`} h={10} borderRadius="0.375rem" />
      ))}
    </VStack>
  );
}

export default SkeletonArray;
