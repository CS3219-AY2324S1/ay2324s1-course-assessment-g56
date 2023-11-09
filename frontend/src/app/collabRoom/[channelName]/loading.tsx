import SkeletonArray from '@/components/skeleton/SkeletonArray';
import { Box } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box p={4}>
      <SkeletonArray />
    </Box>
  );
}
