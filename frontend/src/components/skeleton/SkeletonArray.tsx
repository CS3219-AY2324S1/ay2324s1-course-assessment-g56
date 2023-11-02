import { Skeleton, VStack } from '@chakra-ui/react';

const skeletonArray = new Array(10).fill(0);

function SkeletonArray() {
  return (
    <VStack spacing={6} align="stretch">
      {skeletonArray.map(() => (
        <Skeleton h={10} style={{ borderRadius: '0.375rem' }} />
      ))}
    </VStack>
  );
}

export default SkeletonArray;
