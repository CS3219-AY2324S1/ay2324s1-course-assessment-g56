'use client';

import VideoCollection from '@/components/video/VideoCollection';
import { Box } from '@chakra-ui/react';

function Page() {
  return (
    <Box>
      <VideoCollection roomId="1" partnerUsername="Test" />{' '}
    </Box>
  );
}

export default Page;
